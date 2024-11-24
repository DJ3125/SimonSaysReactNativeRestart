import {Audio} from "expo-av";

interface soundList {
  correctAnswer: Audio.Sound| null,
  correctRound: Audio.Sound| null,
  wrongAnswer: Audio.Sound| null,
}

export const sounds: soundList = {
  correctAnswer: null,
  correctRound: null,
  wrongAnswer: null,
}

let finishedLoading = false;

const soundPromises = Promise.all([
  Audio.Sound.createAsync(require("./assets/correctRound.mp3")), 
  Audio.Sound.createAsync(require("./assets/correct.mp3")), 
  Audio.Sound.createAsync(require("./assets/wrong.mp3"))
]);

soundPromises.then(function(soundArray: {sound: Audio.Sound}[]){
  sounds.correctAnswer = soundArray[1].sound;
  sounds.correctRound = soundArray[0].sound;
  sounds.wrongAnswer = soundArray[2].sound;
}, function(){
  console.log("Sounds Failed to Load");
}).then(function(){
  finishedLoading = true;
  handlers.forEach(element => {
    element();
  });
  while(handlers.length > 0){handlers.pop();}
});

export async function playAudio(audio: Audio.Sound | null){
  if(audio === null){console.log("Sound Error"); return;}
  await audio.stopAsync();
  await audio.playAsync();
}

const handlers: (()=> void)[] = [];

export function onSoundsLoaded(handler: (()=> void)):void{
  if(finishedLoading){handler(); return;}
  handlers.push(handler);
}