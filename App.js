import 'react-native-gesture-handler';
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { FrappeApp } from "frappe-js-sdk";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { AppNavigator } from "./src/infra/navigation.component";


import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
  Button,
} from "@ui-kitten/components";
import { BASE_URI, SECURE_AUTH_STATE_KEY } from "./src/data/constants";
import { default as theme } from "./theme.json";

const HomeScreen = () => (
  <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text category="h1">HOME</Text>
    <Button onPress={() => {}}>Hello</Button>
  </Layout>
);

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
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <IconRegistry icons={EvaIconsPack} />
      <AppNavigator/>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});