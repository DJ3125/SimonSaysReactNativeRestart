import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import {useState, useRef, useEffect} from 'react';

import {Gyroscope} from 'expo-sensors';

export default function App() {
  const gyroData = useRef({x: 0, y: 0, z: 0,});
  const [data, setData] = useState(gyroData);
  useEffect(function(){
    
  }, [gyroData.current.x]);

  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
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
