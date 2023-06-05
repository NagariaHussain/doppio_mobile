import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import styled from 'styled-components/native'
import { Layout, Text, Button, Divider } from "@ui-kitten/components";
import { AuthContext } from "../provider/auth";


const LogoutButton = styled(Button)`
  border-radius: 6px;
`

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
          <LogoutButton
            onPress={() => {
              logout();
            }}
          >
            Logout
          </LogoutButton>
        )}
      </Layout>
    </SafeAreaView>
  );
};
