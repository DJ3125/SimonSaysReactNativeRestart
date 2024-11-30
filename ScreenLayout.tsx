import { StyleSheet, View} from 'react-native';
import {JSX} from "react";

export default function ScreenLayout({children}: {children: JSX.Element}):JSX.Element{
  return (<View style={[styles.center, {flex: 1}]}>
    {children}
    <Background/>
  </View>);
}

function Background(): JSX.Element{
  return (<View style={styles.background}></View>);
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center', 
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: "90%",
    height: "60%",
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
});

export const centerStyle = styles.center;
export const innerContainerStyle = styles.innerContainer;
