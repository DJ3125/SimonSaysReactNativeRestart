import {View, Text, Button} from 'react-native';
import {JSX} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {getUserAttributes, signOutUser} from "../Firebase";
import ScreenLayout, {centerStyle, innerContainerStyle} from "../ScreenLayout";

type Props = {
  navigation: StackNavigationProp<navTypes, "HomeScreen">,
  route: RouteProp<navTypes, "HomeScreen">
}

export default function HomeScreen({navigation, route}: Props): JSX.Element{
  return (
    <ScreenLayout>
      <View style={[centerStyle, innerContainerStyle]}>
        <Text>Hello {getUserAttributes().username}</Text>
        <Text>Your largest streak is {getUserAttributes().largestStreak}</Text>
        <Text>Simon Says Game</Text>
        <Button title="Go to leaderboard" onPress={()=>{
          navigation.navigate("LeaderBoardScreen");
        }}/>
        <Button title="Start Game" onPress={()=>{navigation.navigate("GameScreen", {numQuestions: 1});}}/>
        <Button title="Log Out" onPress={()=>{
          signOutUser().then(function(){
            navigation.navigate("LoginScreen");
          }).catch(function(){
            console.log("Error signing out");
          });
        }}/>
      </View>
    </ScreenLayout>
  );
}