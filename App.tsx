import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import SimonSaysScreen from "./screens/SimonSaysScreen";
import WinScreen from "./screens/RoundWinScreen";
import LoseScreen from "./screens/LoseScreen";
import LoginScreen from "./screens/LoginScreen";

export type navTypes = {
  GameScreen: {numQuestions: number},
  LoseScreen: {score: number},
  WinScreen: {roundsCorrect: number},
  HomeScreen: undefined,
  LoginScreen: undefined,
}

const Stack = createStackNavigator<navTypes>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}/>
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