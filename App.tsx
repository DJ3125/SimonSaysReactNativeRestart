import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import {useState, useRef, useEffect} from 'react';

import {Gyroscope} from 'expo-sensors';

export default function App() {
  const gyroData = useRef({x: 0, y: 0, z: 0,});
  const [data, setData] = useState(gyroData.current);
  
  useEffect(function(){
    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener((data)=>{
      gyroData.current = {
        x: data.x,
        y: data.y,
        z: data.z,
      };
    });
  
  useEffect(function(){
    const {x, y, z} = gyroData.current;
    setData({
      "x": x,
      "y": y,
      "z": z,
    });
  }, [gyroData.current.x]);

  
  });

  return (
    <View style={styles.container}>
      <Text>{data.x}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
