import { StyleSheet, View, Text, Button} from 'react-native';

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";

type Props = {
  navigation: StackNavigationProp<navTypes, "WinScreen">,
  route: RouteProp<navTypes, "WinScreen">,
}

export default function WinScreen({navigation, route}: Props){
  return (<View style={styles.container}>
    <Text>You Win!!</Text>
    <Text>You Have {route.params.roundsCorrect} wins!</Text>
    <Button title="StartGame" onPress={()=>{navigation.navigate("GameScreen", {numQuestions: route.params.roundsCorrect + 1});}}/>
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