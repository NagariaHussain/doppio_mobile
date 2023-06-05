import "react-native-gesture-handler";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppNavigator } from "./src/infra/navigation.component";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { AuthProvider } from "./src/provider/auth";

import { default as theme } from "./theme.json";

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <IconRegistry icons={EvaIconsPack} />
    </ApplicationProvider>
  );
}
