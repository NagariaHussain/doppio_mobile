import { useEffect, useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { FrappeApp } from "frappe-js-sdk";
import { BASE_URI, SECURE_AUTH_STATE_KEY } from "./src/data/constants";

export default function App() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "io.changemakers.app",
    path: "auth",
  });

  const [code, setCode] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

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

  useEffect(() => {
    SecureStore.getItemAsync(SECURE_AUTH_STATE_KEY)
      .then((result) => {
        if (result) {
          console.log("Found stored auth state");
          const { accessToken, refreshToken } = JSON.parse(result);
          setToken(accessToken);
          setRefreshToken(refreshToken);
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
              .then((res) => {
                const auth = res;
                const storageValue = JSON.stringify(auth);

                if (Platform.OS !== "web") {
                  // Securely store the auth on your device
                  SecureStore.setItemAsync(SECURE_AUTH_STATE_KEY, storageValue);
                }

                const { accessToken, refreshToken } = auth;
                setToken(accessToken);
                setRefreshToken(refreshToken);
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
    <View style={styles.container}>
      <Button
        disabled={!request}
        onPress={() => {
          console.log("Triggering button click");
          promptAsync();
        }}
        title="Login with Frappe"
      />

      <View>
        <Text>Response: {JSON.stringify(token)}</Text>
      </View>

      <Button
        onPress={() => {
          const frappe = new FrappeApp(BASE_URI, {
            useToken: true,
            // Pass a custom function that returns the token as a string - this could be fetched from LocalStorage or auth providers like Firebase, Auth0 etc.
            token: () => token,
            // This can be "Bearer" or "token"
            type: "Bearer",
          });

          const auth = frappe.auth();

          auth
            .getLoggedInUser()
            .then((user) => console.log(`User ${user} is logged in.`))
            .catch((error) => console.error(error));
        }}
        title="Get User ID"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
