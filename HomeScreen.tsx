import { StyleSheet, View, Text, Button} from 'react-native';

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";


export default function HomeScreen(){
  return (<View>
    <Text>Simon Says Game</Text>
    <Button title="StartGame" onPress={}/>
  </View>);
}