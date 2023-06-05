import LoginScreen from "../../screens/login.screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export const AuthNavigator = () => {
  const { Navigator, Screen } = createNativeStackNavigator();

  return (
    <Navigator>
      <Screen name="Login" component={LoginScreen} />
    </Navigator>
  );
};
