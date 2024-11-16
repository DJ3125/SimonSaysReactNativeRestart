import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image} from 'react-native';

import {createContext, useContext, useState, useEffect} from 'react';

import {Gyroscope} from 'expo-sensors';

import {SimonSaysActions, generateDirectionSequence} from './SimonSaysLogic';

const SimonSaysContext = createContext<SimonSaysActions|null>(null);

export default function App() {
  const [data, setData] = useState({x: 0, y: 0, z: 0});
  const [highlightedDirection, setHighlightedDirection] = useState<SimonSaysActions | null>(null);
  // const numX = useRef(0);


  useEffect(function(){
    Gyroscope.setUpdateInterval(150);
    Gyroscope.addListener(({x, y, z})=>{
      // setData({x: x, y: y, z: z,});
    });
    
    const sequence: SimonSaysActions[] = generateDirectionSequence(5);
    // console.log(sequence);
    let index = 0;
    const interval = window.setInterval(()=>{
      if(index >= sequence.length){
        window.clearInterval(interval);
        setHighlightedDirection(null);
        return;
      }
      if((interval + 1)%2 === 0){
        setHighlightedDirection(null);
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

function generateImageFromRowCol(row: number, col: number, selected: SimonSaysActions | null){
  console.log("render: " + row + "," + col);
  console.log(selected);
  if(row === 0 && col === 1){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_UP ? styles.imgFilter : {};
    return (<Image style={[styles.imgDirections, extraFeatureOnSelected]} source={require("./assets/up.png")}></Image>);  
  }
  if(row === 1 && col === 2){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_RIGHT ? styles.imgFilter : {};
    return (<Image style={[styles.imgDirections, extraFeatureOnSelected]} source={require("./assets/right.png")}></Image>);
  }
  if(row === 1 && col === 0){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_LEFT ? styles.imgFilter : {};
    return (<Image style={[styles.imgDirections, extraFeatureOnSelected]} source={require("./assets/left.png")}></Image>);
  }
  if(row === 2 && col === 1){
    const extraFeatureOnSelected = selected === SimonSaysActions.TILT_DOWN ? styles.imgFilter : {};
    return (<Image style={[styles.imgDirections, extraFeatureOnSelected]} source={require("./assets/down.png")}></Image>);
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
    // borderColor: "black", 
    overflow: "hidden",
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
