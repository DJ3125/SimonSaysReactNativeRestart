export enum SimonSaysActions {
  TILT_LEFT,
  TILT_RIGHT,
  TILT_UP,
  TILT_DOWN,
}

function generateDirectionSequence(length: number): SimonSaysActions[]{
  if(length <= 0){throw "IndexOutOfBounds";}
  const sequence: SimonSaysActions[] = [];
  const options: (keyof typeof SimonSaysActions)[] = Object.keys(SimonSaysActions).filter(key => isNaN(Number(key))) as (keyof typeof SimonSaysActions)[];
  for(let i:number = 0; i < length; i++){
    sequence.push(SimonSaysActions[options[Math.floor(Math.random() * options.length)]]);
  }
  return sequence;
}


export class SimonSaysTest {
  readonly order: SimonSaysActions[];
  private currentAnswerIndex: number;
  private isDone: boolean;

  constructor(length: number){
    this.order = generateDirectionSequence(length);
    console.log(this.order);
    this.currentAnswerIndex = 0;
    this.isDone = false;
  }

  answerQuestion(action : SimonSaysActions): boolean{
    if(this.isDone){throw "Cannot keep on going if done";}
    if(action != this.order[this.currentAnswerIndex]){
      this.isDone = true;
      return false;
    }
    console.log("correct");
    if(++this.currentAnswerIndex >= this.order.length){this.isDone = true;}
    return true;
  }

  isTestDone(): boolean{return this.isDone;}
  getOrder(): SimonSaysActions[]{return this.order;}
  getAmountAnsweredCorrect():number{return this.currentAnswerIndex;}
  getTotalAmount():number{return this.order.length;}
}