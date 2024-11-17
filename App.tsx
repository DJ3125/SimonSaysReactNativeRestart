import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Pressable} from 'react-native';

import {createContext, useContext, useState, useEffect, useRef} from 'react';


import {SimonSaysActions, SimonSaysTest} from './SimonSaysLogic';
import {Initialize as InitializeTilt, addListener as addTiltListener} from "./DeviceTiltLogic";


const SimonSaysContext = createContext<SimonSaysActions | null>(null);
let animationPlaying = false;
let currentGame = new SimonSaysTest(5);

export default function App() {
  // const [rotation, setRotation] = useState({x: 0, y: 0, z: 0});
  const [highlightedDirection, setHighlightedDirection] = useState<SimonSaysActions | null>(null);
  // const animationPlaying = useRef<boolean>(false);


  useEffect(function(){
    InitializeTilt();
    addTiltListener(triggerAction);
    animationPlaying = true;
    const sequence: SimonSaysActions[] = currentGame.getOrder();
    let index = 0;
    const interval = window.setInterval(()=>{
      if(index >= sequence.length){
        window.clearInterval(interval);
        setHighlightedDirection(null);
        animationPlaying = false;
        return;
      }
      setHighlightedDirection(sequence[index]);
      index++;
    }, 1000);
  }, []);

  return (
    <SimonSaysContext.Provider value={highlightedDirection}>
      <View style={styles.container}>
        <View style={{flex: 1, width: "100%", alignItems: "center", justifyContent: "center", borderColor: "red", borderWidth: 2}}>
          <Text style={{height: "10%", textAlign: "center", borderColor: "green", borderWidth: 2}}>Hello There!!{highlightedDirection}</Text>
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
    </SimonSaysContext.Provider>
  );
}

function triggerAction(action: SimonSaysActions):void{
  if(animationPlaying || currentGame.isTestDone()){return;}
  if(!currentGame.answerQuestion(action)){
    console.log("ded");
    return;
  }
  if(currentGame.isTestDone()){
    console.log("win");
  }
}


function generateImageFromRowCol(row: number, col: number, selected: SimonSaysActions | null){
  // console.log("render: " + row + "," + col);
  // console.log(selected);
  if(row === 0 && col === 1){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_UP ? styles.imgFilter : {};
    return (
      <Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_UP)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/up.png")}/>
        
      </Pressable>
    );  
  }
  if(row === 1 && col === 2){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_RIGHT ? styles.imgFilter : {};
    return (
      <Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_RIGHT)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/right.png")}/>
      </Pressable>
    );
  }
  if(row === 1 && col === 0){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_LEFT ? styles.imgFilter : {};
    return (
      <Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_LEFT)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/left.png")}/>
      </Pressable>
    );
  }
  if(row === 2 && col === 1){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_DOWN ? styles.imgFilter : {};
    return (
      <Pressable style={styles.imgContainer} onPress={()=>{triggerAction(SimonSaysActions.TILT_DOWN)}}>
        <Image 
          style={[styles.imgDirections, extraFeatureOnSelected]} 
          source={require("./assets/down.png")}/>
      </Pressable>
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
    borderColor: "blue",
    borderWidth: 2, 
  },
  directionParent: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: "blue",
    borderWidth: 2,
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
