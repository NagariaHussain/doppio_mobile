import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "../../screens/home.screen";
import { DetailsScreen } from "../../screens/details.screen";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthNavigator } from "./auth.navigator";
import { AuthContext } from "../../provider/auth";
import { TodoScreen } from "../../screens/todo.screen";

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="Home" />
    <BottomNavigationTab title="Todos" />
    <BottomNavigationTab title="User" />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Screen name="Home" component={HomeScreen} />
    <Screen name="ToDo" component={TodoScreen} />
    <Screen name="Details" component={DetailsScreen} />
  </Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
