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
      setData({x: data.x + x, y: data.y + y, z: data.z + z,});
    });
  }, []);

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
