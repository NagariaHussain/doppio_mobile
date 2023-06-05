import React, { createContext, useState, useEffect } from "react";
import { BASE_URI, SECURE_AUTH_STATE_KEY } from "../data/constants";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { FrappeApp } from "frappe-js-sdk";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "io.frappe.changemakers",
    path: "auth",
  });

  const [accessToken, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userID, setUserID] = useState(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "f592ecba60",
      redirectUri,
      responseType: "code",
      scopes: ["all"],
      usePKCE: false,
    },
    {
      authorizationEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.authorize`,
      tokenEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.get_token`,
    }
  );

  const logout = async () => {
    await SecureStore.deleteItemAsync(SECURE_AUTH_STATE_KEY);
    setIsAuthenticated(false);
    setToken(null);
    setRefreshToken(null);
    setUserID(null);
  };

  const refreshAccessTokenAsync = async () => {
    AuthSession.refreshAsync(
      {
        refreshToken,
      },
      {
        tokenEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.get_token`,
      }
    ).then(async (res) => {
      const authResponse = res;
      const storageValue = JSON.stringify(authResponse);
      await SecureStore.setItemAsync(SECURE_AUTH_STATE_KEY, storageValue);
    });
  };

  useEffect(() => {
    SecureStore.getItemAsync(SECURE_AUTH_STATE_KEY)
      .then((result) => {
        if (result) {
          console.log("Found stored auth state");
          const { accessToken, refreshToken } = JSON.parse(result);
          setToken(accessToken);
          setRefreshToken(refreshToken);
          setIsAuthenticated(true);
        } else {
          if (response?.type === "success") {
            const { code } = response.params;
            AuthSession.exchangeCodeAsync(
              {
                redirectUri,
                code,
                extraParams: {
                  grant_type: "authorization_code",
                  client_id: "f592ecba60",
                },
                clientId: "f592ecba60",
              },
              {
                tokenEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.get_token`,
              }
            )
              .then(async (res) => {
                const authResponse = res;
                const storageValue = JSON.stringify(authResponse);
                await SecureStore.setItemAsync(
                  SECURE_AUTH_STATE_KEY,
                  storageValue
                );

                const { accessToken, refreshToken } = authResponse;
                setToken(accessToken);
                setRefreshToken(refreshToken);
                setIsAuthenticated(true);

                const frappe = new FrappeApp(BASE_URI, {
                  useToken: true,
                  type: "Bearer",
                  token: () => accessToken,
                });

                const auth = frappe.auth();

                const user = await auth.getLoggedInUser();
                setUserID(user);
              })
              .catch((err) => {
                console.error(err);
              });
          }
        }
      })
      .catch((e) => console.error(e));
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        userID,
        request,
        promptAsync,
        logout,
        refreshAccessTokenAsync
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
