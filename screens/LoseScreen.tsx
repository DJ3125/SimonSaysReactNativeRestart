import { StyleSheet, View, Text, Button} from 'react-native';

import {useEffect} from "react";

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {registerStreak} from "../Firebase";

type Props = {
  navigation: StackNavigationProp<navTypes, "LoseScreen">,
  route: RouteProp<navTypes, "LoseScreen">,
}

export default function LoseScreen({navigation, route}: Props){
  useEffect(function(){
    registerStreak(route.params.score);
  }, []);
  return (<View style={styles.container}>
    <Text>You Lose!</Text>
    <Text>Streak: {route.params.score}</Text>
    <Button title="Retry" onPress={()=>{navigation.navigate("GameScreen", {numQuestions: 1});}}/>
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