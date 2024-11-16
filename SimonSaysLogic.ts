export enum SimonSaysActions {
  TILT_LEFT,
  TILT_RIGHT,
  TILT_UP,
  TILT_DOWN,
}

export function generateDirectionSequence(length: number): (SimonSaysActions[]){
  if(length < 0){throw "IndexOutOfBounds";}
  const sequence: SimonSaysActions[] = [];
  const options: (keyof typeof SimonSaysActions)[] = Object.keys(SimonSaysActions).filter(key => isNaN(Number(key))) as (keyof typeof SimonSaysActions)[];
  for(let i:number = 0; i < length; i++){
    sequence.push(SimonSaysActions[options[Math.floor(Math.random() * options.length)]]);
  }
  return sequence;
}