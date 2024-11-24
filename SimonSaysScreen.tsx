import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image} from 'react-native';

import {useState, useEffect} from 'react';


import {SimonSaysActions, SimonSaysTest} from './SimonSaysLogic';
import {Initialize as InitializeTilt, addListener as addTiltListener} from "./DeviceTiltLogic";

import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {navTypes} from "./App";
import {sounds, playAudio, onSoundsLoaded} from "./Sounds";

type Props = {
  navigation: StackNavigationProp<navTypes, "GameScreen">,
  route: RouteProp<navTypes, "GameScreen">,
}

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

export default function SimonSaysScreen({navigation, route}: Props) {
  const [highlightedDirection, setHighlightedDirection] = useState<SimonSaysActions | null>(null);
  useEffect(function(){
    InitializeTilt();
    addTiltListener(triggerAction);
    navigationObject = navigation;
    currentGame = new SimonSaysTest(route.params.numQuestions);
    onSoundsLoaded(()=> {displayAnimation(setHighlightedDirection);});    
  }, []);

  return (
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
        
        <View style={styles.directionParent}>
          {
            Array.from({length: 3}, (_, row)=>(
              <View key={row} style={{width: "100%", flex: 1, flexDirection: "row"}}>
                {
                  Array.from({length: 3}, (_, col)=>(
                    <View key={col} style={styles.gridItem}>
                      {generateImageFromRowCol(row, col, highlightedDirection)}
                    </View>
                  ))
                }
              </View>
            ))
          }
        </View>
      </View>
  );
}

function triggerAction(action: SimonSaysActions):void{
  if(animationPlaying || currentGame.isTestDone()){return;}
  if(!currentGame.answerQuestion(action)){
    playAudio(sounds.wrongAnswer);
    navigationObject.navigate("LoseScreen", {score: currentGame.getOrder().length - 1});
    return;
  }
  if(currentGame.isTestDone()){
    console.log("win");
    playAudio(sounds.correctRound);
    navigationObject.navigate("WinScreen", {roundsCorrect: currentGame.getOrder().length});
    return;
  }
  playAudio(sounds.correctAnswer);
}


function generateImageFromRowCol(row: number, col: number, selected: SimonSaysActions | null){
  if(row === 0 && col === 1){
    return (<Image 
      style={[styles.imgDirections, selected === SimonSaysActions.TILT_UP ? styles.imgFilter : {}]} 
      source={require("./assets/up.png")}/>
    );  
  }
  if(row === 1 && col === 2){
    return (<Image
      style={[styles.imgDirections, selected === SimonSaysActions.TILT_RIGHT ? styles.imgFilter : {}]} 
      source={require("./assets/right.png")}/>
    );
  }
  if(row === 1 && col === 0){
    return (<Image 
      style={[styles.imgDirections, selected === SimonSaysActions.TILT_LEFT ? styles.imgFilter : {}]} 
      source={require("./assets/left.png")}/>
    );
  }
  if(row === 2 && col === 1){
    return (<Image 
      style={[styles.imgDirections, selected === SimonSaysActions.TILT_DOWN ? styles.imgFilter : {}]} 
      source={require("./assets/down.png")}/> 
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
  },
  directionParent: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
