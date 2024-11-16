import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import {useState, useRef, useEffect} from 'react';

import {Gyroscope} from 'expo-sensors';

export default function App() {
  const [data, setData] = useState({x: 0, y: 0, z: 0});
  // const numX = useRef(0);
  useEffect(function(){
    Gyroscope.setUpdateInterval(150);
    Gyroscope.addListener(({x, y, z})=>{
      setData({x: x, y: y, z: z,});
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text>{data.x}</Text> */}
      {/* <StatusBar style="auto" /> */}
      
      <View style={styles.container}>
        
        {
          Array.from({length: 3}, (_, row)=>(
            <View key={row} style={{width: "100%", flexDirection: "row"}}>
              {
                Array.from({length: 3}, (_, col)=>(
                  <View key={col} style={styles.gridItem}>
                    <Text>{row},{col}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // width: "100%",
    borderColor: "blue",
    borderWidth: 2,
     
  },
  gridItem: {
    width: "33%",
    height: 100,
    borderWidth: 2,
    borderColor: "black", 
  }
});
