import React, { createContext, useState, useEffect } from "react";
import {
  BASE_URI,
  OAUTH_CLIENT_ID,
  REDIRECT_URL_SCHEME,
  SECURE_AUTH_STATE_KEY,
} from "../data/constants";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { FrappeApp } from "frappe-js-sdk";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: REDIRECT_URL_SCHEME,
    path: "auth",
  });

  const [accessToken, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: OAUTH_CLIENT_ID,
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

  const fetchUserInfo = async () => {
    if (!accessToken) {
      console.error("accessToken not found");
      return;
    }

    const frappe = new FrappeApp(BASE_URI, {
      useToken: true,
      type: "Bearer",
      token: () => accessToken,
    });


    try {
      const call = frappe.call();
      const userInfo = await call.get("frappe.integrations.oauth2.openid_profile")
      setUserInfo(userInfo);
    } catch (e) {
      if (e.httpStatus === 403) {
        // refresh token
        await refreshAccessTokenAsync();
      }
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(SECURE_AUTH_STATE_KEY);
    setIsAuthenticated(false);
    setToken(null);
    setRefreshToken(null);
    setUserInfo(null);
  };

  const refreshAccessTokenAsync = async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    AuthSession.refreshAsync(
      {
        refreshToken,
      },
      {
        tokenEndpoint: `${BASE_URI}/api/method/frappe.integrations.oauth2.get_token`,
      }
    )
      .then(async (res) => {
        const authResponse = res;
        const storageValue = JSON.stringify(authResponse);
        await SecureStore.setItemAsync(SECURE_AUTH_STATE_KEY, storageValue);

        setToken(authResponse.accessToken);
        setRefreshToken(authResponse.refreshToken);
        setIsAuthenticated(true);

        const frappe = new FrappeApp(BASE_URI, {
          useToken: true,
          type: "Bearer",
          token: () => accessToken,
        });
        const call = frappe.call();
        const userInfo = await call.get("frappe.integrations.oauth2.openid_profile")
        setUserInfo(userInfo);
      })
      .catch((err) => {
        // unable to refresh
        // clean up auth state
        logout();
        console.error(err);
      });
  };

  useEffect(() => {
    SecureStore.getItemAsync(SECURE_AUTH_STATE_KEY)
      .then((result) => {
        if (result) {
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
                  client_id: OAUTH_CLIENT_ID,
                },
                clientId: OAUTH_CLIENT_ID,
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

                setToken(authResponse.accessToken);
                setRefreshToken(authResponse.refreshToken);
                setIsAuthenticated(true);
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            console.log("Not authenticated")
          }
        }
      })
      .catch((e) => console.error(e));
  }, [response]);

  useEffect(() => {
    if (accessToken) {
      fetchUserInfo();
    }
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        userInfo,
        request,
        promptAsync,
        logout,
        refreshAccessTokenAsync,
        fetchUserInfo
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
