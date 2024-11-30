import {View, Text, Button} from 'react-native';
import {JSX} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import ScreenLayout, {centerStyle, innerContainerStyle} from "../ScreenLayout";

type Props = {
  navigation: StackNavigationProp<navTypes, "WinScreen">,
  route: RouteProp<navTypes, "WinScreen">,
}

export default function WinScreen({navigation, route}: Props): JSX.Element{
  return (<ScreenLayout>
    <View style={[centerStyle, innerContainerStyle]}>
      <Text>You Win!!</Text>
      <Text>You Have {route.params.roundsCorrect} wins!</Text>
      <Button title="Continue" onPress={()=>{navigation.navigate("GameScreen", {numQuestions: route.params.roundsCorrect + 1});}}/>
    </View>
  </ScreenLayout>);
}
