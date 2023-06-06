import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Layout, Modal, Card, Text } from "@ui-kitten/components";

export const HomeScreen = () => {
  const navigateDetails = () => {
    setVisible(true);
  };

  const [visible, setVisible] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Button onPress={navigateDetails}>OPEN MODAL</Button>

        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true}>
            <Text>Welcome to DoppioMobile</Text>
            <Button onPress={() => setVisible(false)}>DISMISS</Button>
          </Card>
        </Modal>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
