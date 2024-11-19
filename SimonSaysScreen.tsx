import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image} from 'react-native';

import {useState, useEffect} from 'react';

import {Audio} from "expo-av";

import {SimonSaysActions, SimonSaysTest} from './SimonSaysLogic';
import {Initialize as InitializeTilt, addListener as addTiltListener} from "./DeviceTiltLogic";

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "./App";

type Props = {
  navigation: StackNavigationProp<navTypes, "GameScreen">,
  route: RouteProp<navTypes, "GameScreen">,
}

interface soundList {
  correctAnswer: Audio.Sound| null,
  correctRound: Audio.Sound| null,
  wrongAnswer: Audio.Sound| null,
}

const sounds: soundList = {
  correctAnswer: null,
  correctRound: null,
  wrongAnswer: null,
}

// const SimonSaysContext = createContext<SimonSaysActions | null>(null);

// const answeredContext = createContext<((x: number) => void | null>(null);

let animationPlaying = true;
let currentGame: SimonSaysTest;
let navigationObject: StackNavigationProp<navTypes, "GameScreen">;

function displayAnimation(setHighlightedDirection: (direction: SimonSaysActions | null) => void): void{
  animationPlaying = true;
  const sequence: SimonSaysActions[] = currentGame.getOrder();
  let index = 0;
  const interval = window.setInterval(()=>{
    if(index >= sequence.length * 2 - 1){
      window.clearInterval(interval);
      setHighlightedDirection(null);
      animationPlaying = false;
      return;
    }
    if(index%2 === 1){
      setHighlightedDirection(null);
      index++;
      return;
    }
    setHighlightedDirection(sequence[index/2]);
    index++;
  }, 1000);
}

async function playAudio(audio: Audio.Sound){
  await audio.stopAsync();
  await audio.playAsync();
}



export default function SimonSaysScreen({navigation, route}: Props) {
  // const [rotation, setRotation] = useState({x: 0, y: 0, z: 0});
  const [highlightedDirection, setHighlightedDirection] = useState<SimonSaysActions | null>(null);
  // const [amountCorrect, setAmountCorrect] = useState(0);
  // const animationPlaying = useRef<boolean>(false);


  useEffect(function(){
    InitializeTilt();
    addTiltListener(triggerAction);
    navigationObject = navigation;
    currentGame = new SimonSaysTest(route.params.numQuestions);


    Promise.all([
      Audio.Sound.createAsync(require("./assets/correctRound.mp3")), 
      Audio.Sound.createAsync(require("./assets/correct.mp3")), 
      Audio.Sound.createAsync(require("./assets/wrong.mp3"))
    ]).then(function(soundArray: {sound: Audio.Sound}[]){
      sounds.correctAnswer = soundArray[1].sound;
      sounds.correctRound = soundArray[0].sound;
      sounds.wrongAnswer = soundArray[2].sound;
      displayAnimation(setHighlightedDirection);
    });

    
  }, []);

  return (
    // <SimonSaysContext.Provider value={highlightedDirection}>
      <View style={styles.container}>
        <View style={{flex: 1, width: "100%", alignItems: "center", justifyContent: "center"}}>
          <Text style={{height: "10%", textAlign: "center"}}>{
            // animationPlaying ? 
              (highlightedDirection === 0 ? "Left":
              highlightedDirection === 1 ? "Right":
              highlightedDirection === 2 ? "Up":
              highlightedDirection === 3 ? "Down": "")
            // : `${} Out of ${currentGame.getTotalAmount()}` 
          }</Text>
        </View>
        
        <StatusBar style="auto" />
        
        <View style={styles.directionParent}>
          
          {
            Array.from({length: 3}, (_, row)=>(
              <View key={row} style={{width: "100%", flex: 1, flexDirection: "row"}}>
                {
                  Array.from({length: 3}, (_, col)=>(
                    <View key={col} style={styles.gridItem}>
                      {/* <Text>{row},{col}</Text> */}
                      {generateImageFromRowCol(row, col, highlightedDirection)}
                    </View>
                  ))
                }
              </View>
            ))
          }
          
        </View>
      </View>
    // </SimonSaysContext.Provider>
  );
}

function triggerAction(action: SimonSaysActions):void{
  if(animationPlaying || currentGame.isTestDone()){return;}
  if(!currentGame.answerQuestion(action)){
    playAudio(sounds.wrongAnswer as Audio.Sound);
    // if(navigationObject === null){throw "Navigation not initialized";}
    navigationObject.navigate("LoseScreen", {score: currentGame.getOrder().length - 1});
    return;
  }
  if(currentGame.isTestDone()){
    console.log("win");
    playAudio(sounds.correctRound as Audio.Sound);
    navigationObject.navigate("WinScreen", {roundsCorrect: currentGame.getOrder().length});
    // if(navigationObject === null){throw "Navigation not initialized";}
    return;
  }
  playAudio(sounds.correctAnswer as Audio.Sound);
}


function generateImageFromRowCol(row: number, col: number, selected: SimonSaysActions | null){
  // console.log("render: " + row + "," + col);
  // console.log(selected);
  if(row === 0 && col === 1){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_UP ? styles.imgFilter : {};
    return (
      //<Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_UP)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/up.png")}/>
        
      //</Pressable>
    );  
  }
  if(row === 1 && col === 2){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_RIGHT ? styles.imgFilter : {};
    return (
      //<Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_RIGHT)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/right.png")}/>
      //</Pressable>
    );
  }
  if(row === 1 && col === 0){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_LEFT ? styles.imgFilter : {};
    return (
      //<Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_LEFT)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/left.png")}/>
      //</Pressable>
    );
  }
  if(row === 2 && col === 1){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_DOWN ? styles.imgFilter : {};
    return (
      // <Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_DOWN)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/down.png")}/>
      //</Pressable> 
    );
  }
  return (<Image></Image>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: "blue",
    // borderWidth: 2, 
  },
  directionParent: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderColor: "blue",
    // borderWidth: 2,
  },
  gridItem: {
    width: "33%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: "hidden",
  },

  imgContainer: {
    height: "100%",
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgDirections: {
    width: "70%",
    height: "70%",
  },
  imgFilter: {
    width: "100%",
    height: "100%",
  },
});
