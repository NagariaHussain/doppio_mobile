import React, { useContext } from "react";
import { AuthContext } from "../provider/auth";

import { Layout, Button } from "@ui-kitten/components";

const LoginScreen = () => {
  const { isAuthenticated, promptAsync, request } = useContext(AuthContext);

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        rowGap: 20,
      }}
    >
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
  );
};

export default LoginScreen;
