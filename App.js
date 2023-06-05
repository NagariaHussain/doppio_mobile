import { useEffect, useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import * as AuthSession from "expo-auth-session";

const BASE_URI = "https://apf-changemakers-staging.frappe.cloud";

export default function App() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "io.changemakers.app",
    path: "auth",
  });

  console.log(redirectUri);

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
    if (response?.type === "success" && !token) {
      const { code } = response.params;

      console.log("code: ");
      console.log(code);

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
          const { accessToken, refreshToken } = res;
          setToken(accessToken);
          setRefreshToken(refreshToken);
        })
        .catch((err) => {
          console.error(err);
        });

      setCode(code);
    }
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
