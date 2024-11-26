import { StyleSheet, View, Text, Button} from 'react-native';
import {useState, useEffect, JSX} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {getTopScorers, PlayerAttributes} from '../Firebase';

type Props = {
  navigation: StackNavigationProp<navTypes, "LeaderBoardScreen">,
  route: RouteProp<navTypes, "LeaderBoardScreen">
}

export default function LeaderBoardScreen({navigation, route}: Props): JSX.Element{
  const [leaderBoard, setLeaderBoard] = useState(<Text>Loading</Text>);
  useEffect(function(){
    generateLeaderBoard().then(function(tsx){});
  }, []);
  return (<View>
    {leaderBoard}
    <Button title="Go Back to home" onPress={()=>{navigation.navigate("HomeScreen");}}/>
  </View>);
}

async function generateLeaderBoard(): Promise<JSX.Element>{
  const people: PlayerAttributes[] = await getTopScorers(5);
  return (<View>
    {Array.from(people, (v, i)=>(
      <Text key={i}>{i}. {v.username}, Streak: {v.largestStreak}</Text>
    ))}
  </View>);
}