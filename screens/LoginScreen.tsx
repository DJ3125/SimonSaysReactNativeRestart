import {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "../App";
import {logIn} from "../Firebase";

type Props = {
  navigation: StackNavigationProp<navTypes, "LoginScreen">,
  route: RouteProp<navTypes, "LoginScreen">,
}

export default function LoginScreen({navigation, route}: Props){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginProgress, setLoginProgress] = useState("");

  return(
    <View style={styles.container}>
      <Text>Log In</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text:string)=>{
          setUsername(text);
          setLoginProgress("");
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text:string)=>{
          setPassword(text);
          setLoginProgress("");
        }}
      />
      <Button title="Log In" onPress={()=>{
        logIn(username, password).then(function(){
          setLoginProgress("Success");
          navigation.navigate("HomeScreen");
        }).catch(function(){
          setLoginProgress("Error");
        });
      }}/>
      <Text>{loginProgress}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center', 
  },
});