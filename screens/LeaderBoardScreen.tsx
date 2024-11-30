import { StyleSheet, View, Text, Button} from 'react-native';
import {useState, useEffect, JSX} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {getTopScorers, PlayerAttributes} from '../Firebase';
import ScreenLayout, {centerStyle, innerContainerStyle} from "../ScreenLayout";

type Props = {
  navigation: StackNavigationProp<navTypes, "LeaderBoardScreen">,
  route: RouteProp<navTypes, "LeaderBoardScreen">
}

export default function LeaderBoardScreen({navigation, route}: Props): JSX.Element{
  const [leaderBoard, setLeaderBoard] = useState(<Text>Loading</Text>);
  useEffect(function(){
    generateLeaderBoard().then(setLeaderBoard);
  }, []);
  return (<ScreenLayout>
    <View style={[centerStyle, innerContainerStyle]}>
      {leaderBoard}
      <Button title="Go Back to home" onPress={()=>{navigation.navigate("HomeScreen");}}/>
    </View>
  </ScreenLayout>);
}

async function generateLeaderBoard(): Promise<JSX.Element>{
  const people: PlayerAttributes[] = await getTopScorers(5);
  if(people.length === 0){return (<Text>No Users Available</Text>);}
  return (<View style={[centerStyle, {height: "50%"}]}>
    {Array.from(people, (v, i)=>(
      <Text key={i}>{i + 1}. {v.username}, Streak: {v.largestStreak}</Text>
    ))}
  </View>);
}