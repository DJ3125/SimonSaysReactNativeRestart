import {DeviceMotion} from 'expo-sensors';
import {SimonSaysActions} from './SimonSaysLogic';

enum DeviceTilt {
  CENTER = "c",
  LEFT = "l",
  UP = "u",
  RIGHT = "r",
  DOWN = "d",
}

let initialized: boolean = false;
let currentTilt: DeviceTilt = DeviceTilt.CENTER;
const listeners: ((action: SimonSaysActions)=>void)[] = [];

export function Initialize(): void{
  if(initialized){return;}
  initialized = true;
  DeviceMotion.setUpdateInterval(100);
  DeviceMotion.addListener(function({rotation: {beta, gamma}}){
    const beforeTilt = currentTilt;
    currentTilt = calculateTilt(beta, gamma);
    if(beforeTilt === currentTilt){return;}
    const simonSaysTilt = convertTiltToSimonSays(currentTilt);
    if(simonSaysTilt === null){return;}
    listeners.forEach(function(entry: (action: SimonSaysActions) => void){
      entry(simonSaysTilt);
    });
  });
}

export function addListener(entry: (action: SimonSaysActions)=>void): void{
  listeners.push(entry);
}

function calculateTilt(beta: number, gamma: number): DeviceTilt{
  const threshold = 0.7;
  if(beta > threshold){return DeviceTilt.DOWN;}
  if(beta < -1 * threshold){return DeviceTilt.UP;}
  if(gamma > threshold){return DeviceTilt.RIGHT;}
  if(gamma < -1 * threshold){return DeviceTilt.LEFT;}
  return DeviceTilt.CENTER;
}

function convertTiltToSimonSays(tilt: DeviceTilt): SimonSaysActions | null{
  if(tilt === DeviceTilt.LEFT){return SimonSaysActions.TILT_LEFT;}
  if(tilt === DeviceTilt.RIGHT){return SimonSaysActions.TILT_RIGHT;}
  if(tilt === DeviceTilt.DOWN){return SimonSaysActions.TILT_DOWN;}
  if(tilt === DeviceTilt.UP){return SimonSaysActions.TILT_UP;}
  return null;
}