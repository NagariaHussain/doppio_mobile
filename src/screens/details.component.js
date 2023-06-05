import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { Layout, Text, Button, Divider } from "@ui-kitten/components";
import { AuthContext } from "../provider/auth";

export const DetailsScreen = () => {
  const { isAuthenticated, userID, promptAsync, request } =
    useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h4">{isAuthenticated ? userID : "Not Logged In"}</Text>

        <Divider />

        {!isAuthenticated && (
          <Button
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          >
            Login with Frappe
          </Button>
        )}
      </Layout>
    </SafeAreaView>
  );
};
