// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, View, Text, Image} from 'react-native';

// import {useState, useEffect} from 'react';

// import {Audio} from "expo-av";

// import {SimonSaysActions, SimonSaysTest} from './SimonSaysLogic';

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

import HomeScreen from "./HomeScreen";
import SimonSaysScreen from "./SimonSaysScreen";
import WinScreen from "./RoundWinScreen";
import LoseScreen from "./LoseScreen";

export type navTypes = {
  GameScreen: {numQuestions: number},
  LoseScreen: {score: number},
  WinScreen: {roundsCorrect: number},
  HomeScreen: undefined,
}

const Stack = createStackNavigator<navTypes>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}/>
        <Stack.Screen
          name="GameScreen"
          component={SimonSaysScreen}
          options={{headerShown: false}}/>
        <Stack.Screen
          name="WinScreen"
          component={WinScreen}
          options={{headerShown: false}}/>
        <Stack.Screen
          name="LoseScreen"
          component={LoseScreen}
          options={{headerShown: false}}/>    
      </Stack.Navigator>
    </NavigationContainer>
  );
}