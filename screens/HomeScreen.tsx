import { StyleSheet, View, Text, Button} from 'react-native';

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {getUserAttributes} from "../Firebase";

type Props = {
  navigation: StackNavigationProp<navTypes, "HomeScreen">,
  route: RouteProp<navTypes, "HomeScreen">
}

export default function HomeScreen({navigation, route}: Props){
  return (<View style={styles.container}>
    <Text>Hello {getUserAttributes().username}</Text>
    <Text>Your largest streak is {getUserAttributes().largestStreak}</Text>
    <Text>Simon Says Game</Text>
    <Button title="StartGame" onPress={()=>{navigation.navigate("GameScreen", {numQuestions: 1});}}/>
  </View>);
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center', 
  },
});