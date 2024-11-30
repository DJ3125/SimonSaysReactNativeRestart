import {useState, useRef, useEffect, JSX, memo} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Keyboard, Image} from 'react-native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import Animated, {useSharedValue, useAnimatedStyle, withSpring, useAnimatedProps, withTiming, withSequence} from "react-native-reanimated";
import Svg, {Text as SVGText} from "react-native-svg";
import {navTypes} from "../App";
import {logIn} from "../Firebase";

type Props = {
  navigation: StackNavigationProp<navTypes, "LoginScreen">,
  route: RouteProp<navTypes, "LoginScreen">,
}

export default function LoginScreen({navigation, route}: Props): JSX.Element{
  const [loginProgress, setLoginProgress] = useState("");

  const username = useRef("");
  const password = useRef("");

  const login = function(){
    Keyboard.dismiss();
    setLoginProgress("Loading...");
    logIn(username.current, password.current).then(function(){
      setLoginProgress("Success");
      navigation.navigate("HomeScreen");
    }).catch(function(){
      setLoginProgress("Error");
    });
  }
  const usernameChanged = function(text:string){
    setLoginProgress("");
    username.current = text;
  }

  const passwordChanged = function(text:string){
    setLoginProgress("");
    password.current = text;
  }

  return(
    <View style={{height: "100%", width: "100%", alignItems: 'center', justifyContent: 'center'}}>
      <View style={styles.container}>  
        <Title/>
        <UserTextInput placeholder="Username" onChangeText={usernameChanged}/>
        <UserTextInput placeholder="Password" onChangeText={passwordChanged}/>
        <Button title="Log In" onPress={login}/>
        <Text>{loginProgress}</Text>
      </View>
      <Background/>
    </View>
  );
}

const Title = memo(()=>{
  const AnimatedTitle = Animated.createAnimatedComponent(SVGText);
  const timeline = useSharedValue(0);

  const animatedProperties = useAnimatedProps(()=>{
    const duration = 5000;
    return ({
      strokeDasharray: [withTiming(timeline.value, {duration: duration}), withTiming(100 - timeline.value, {duration: duration})],
      strokeDashoffset: withTiming(timeline.value, {duration: duration}),
      fillOpacity: withSequence(withTiming(0, {duration: 4000}), withTiming((timeline.value - 80)/20, {duration: 1000})),
    });
  });

  useEffect(()=>{
   timeline.value = 100;
   console.log("rerun")
  }, []);

  console.log(timeline.value);
  return (<>
    <Svg height="100" width="100%">
      <AnimatedTitle
        stroke="purple"
        fontSize="50"
        fontWeight="bold"
        x="50%"
        y="50%"
        fill="purple"
        animatedProps={animatedProperties}
        textAnchor="middle"
      >Simon Says</AnimatedTitle>
    </Svg>
    <Text style={{marginBottom: 10}}>Log In</Text>
  </>);
});

type TextInputProps = {
  placeholder: string,
  onChangeText: (newVal: string) => void,
}
function UserTextInput({placeholder, onChangeText}: TextInputProps): JSX.Element{
  const [value, setValue] = useState("");
  const switched = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(()=>({
    width: withSpring(switched.value/2 + 200),
    height: withSpring(switched.value/10 + 50)
  }));
  const onFocus = function(){switched.value = 100;}
  const onUnfocus = function(){switched.value = 0;}
  return (<Animated.View style={[styles.inputTextParent, animatedStyles]}>
    <TextInput
      style={styles.inputText}
      placeholder={placeholder}
      value={value}
      onChangeText={(text:string)=>{
        setValue(text);
        onChangeText(text);
      }}
      onFocus={onFocus}
      onBlur={onUnfocus}
    />
  </Animated.View>);
}


function Background(): JSX.Element{
  return (<View style={styles.background}>
    
  </View>);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: "90%",
    height: "60%",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
  },
  background: {
    position: "absolute", 
    height: "100%", 
    width: "100%", 
    backgroundColor: "cyan", 
    zIndex:-1
  },
  inputTextParent: {
    height: 20, 
    justifyContent: "center",
    alignItems: 'center',
    marginBottom: 10,
  },
  inputText: {
    height: "100%", 
    width: "100%", 
    borderColor: "black", 
    borderWidth: 2,
    // alignText: "center"
  },
  // button
});