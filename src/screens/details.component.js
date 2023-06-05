import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { Layout, Text, Button, Divider } from "@ui-kitten/components";
import { AuthContext } from "../provider/auth";

export const DetailsScreen = () => {
  const { isAuthenticated, userID, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h4">{isAuthenticated ? userID : "Not Logged In"}</Text>

        <Divider />

        {isAuthenticated && (
          <Button
            onPress={() => {
              logout();
            }}
          >
            Logout
          </Button>
        )}
      </Layout>
    </SafeAreaView>
  );
};
