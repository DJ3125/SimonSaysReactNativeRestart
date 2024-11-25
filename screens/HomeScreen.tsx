import { StyleSheet, View, Text, Button} from 'react-native';

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {getCurrentUser} from "../Firebase";

type Props = {
  navigation: StackNavigationProp<navTypes, "HomeScreen">,
  route: RouteProp<navTypes, "HomeScreen">
}

export default function HomeScreen({navigation, route}: Props){
  // console.log("dfghjk");
  return (<View style={styles.container}>
    <Text>Hello {getCurrentUser().displayName ?? "Error Here"}</Text>
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