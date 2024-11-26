import { StyleSheet, View, Text, Button} from 'react-native';

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {getTopScorers} from '../Firebase';

type Props = {
  navigation: StackNavigationProp<navTypes, "LeaderBoardScreen">,
  route: RouteProp<navTypes, "LeaderBoardScreen">
}

export default function LeaderBoardScreen({navigation, route}: Props){
  return (<View>
    <View>{}</View>
    <Button title="Go Back to home" onPress={()=>{navigation.navigate("HomeScreen");}}/>
  </View>);
}

function generateLeaderBoard(){
  
}