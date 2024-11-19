// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, View, Text, Image} from 'react-native';

// import {useState, useEffect} from 'react';

// import {Audio} from "expo-av";

// import {SimonSaysActions, SimonSaysTest} from './SimonSaysLogic';

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

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
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

