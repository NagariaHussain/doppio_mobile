import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/home.component';
import { DetailsScreen } from '../screens/details.component';
import {createStackNavigator} from "@react-navigation/stack";


const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='Home' component={HomeScreen}/>
    <Stack.Screen name='Details' component={DetailsScreen}/>
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator/>
  </NavigationContainer>
);