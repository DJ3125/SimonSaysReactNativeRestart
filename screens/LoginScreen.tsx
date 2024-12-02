import {useState, useRef, useEffect, JSX, memo} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Keyboard} from 'react-native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import Animated, {useSharedValue, useAnimatedStyle, withSpring, useAnimatedProps, withTiming, withSequence} from "react-native-reanimated";
import Svg, {Text as SVGText} from "react-native-svg";
import {navTypes} from "../App";
import {logIn} from "../Firebase";
import ScreenLayout, {centerStyle, innerContainerStyle} from "../ScreenLayout";

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
  return (
    <ScreenLayout>
      <View style={[innerContainerStyle, centerStyle]}>  
        <Title/>
        <UserTextInput placeholder="Username" onChangeText={usernameChanged}/>
        <UserTextInput placeholder="Password" onChangeText={passwordChanged}/>
        <Button title="Log In" onPress={login}/>
        <Text>{loginProgress}</Text>
      </View>
    </ScreenLayout>
  );
}

// function loginComponent(username: MutableRefObject<string>, password: MutableRefObject<string>, setLoginProgress: (val:string)=>void, onSuccess:()=>void): JSX.Element{
//   const login = function(){
//     Keyboard.dismiss();
//     setLoginProgress("Loading...");
//     logIn(username.current, password.current).then(function(){
//       setLoginProgress("Success");
//       onSuccess();
//     }).catch(function(){
//       setLoginProgress("Error");
//     });
//   }
//   return(<>
//     <Button title="Log In" onPress={login}/>
//   </>);
// }

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
  // const animatedPropertiesLogIn = useAnimatedProps(()=>{
  //   return ({
  //     transform: [{translateY: withSequence(withTiming(0, {duration: 5000}), withSpring(100-timeline.value))}],
  //     opacity: withSequence(withTiming(0, {duration: 5000}), withTiming(timeline.value/100, {duration: 1000}))
  //   });
  // });

  useEffect(()=>{
   timeline.value = 100;
  }, []);
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
    <Animated.Text style={[{marginBottom: 10, position: "relative"}]}>Log In</Animated.Text>
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


const styles = StyleSheet.create({
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
    textAlign: "center"
  },
});