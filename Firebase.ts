import {initializeApp, FirebaseApp} from "firebase/app";
import {getFirestore, collection, addDoc, Firestore, query, where, QueryDocumentSnapshot, getDocs, QuerySnapshot, updateDoc, doc, orderBy, limit, DocumentData} from "firebase/firestore";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, Auth, User, onAuthStateChanged, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVcmz9jFI4HZk0fzoOvtfndgSSil4gem8",
  authDomain: "simonsaysfirebase-e8b95.firebaseapp.com",
  projectId: "simonsaysfirebase-e8b95",
  storageBucket: "simonsaysfirebase-e8b95.firebasestorage.app",
  messagingSenderId: "332696345030",
  appId: "1:332696345030:web:0e6e42ef91132dc109fac7",
  measurementId: "G-N8F9RMSHFX"
};

const collectionName = "Users";

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Firestore = getFirestore(app);

let userDoc: PlayerAttributes | null = null;

export interface PlayerAttributes {
  "userID": string,
  "largestStreak": number,
  "username": string,
  "docReference": string,
}

function parseDoc(document: QueryDocumentSnapshot<DocumentData, DocumentData>): PlayerAttributes{
  if(document === null || document === undefined){throw "Doc is undefined";}
  const id: string = document.data()?.userID;
  const streak: number = document.data()?.largestStreak ?? 0;
  const username: string = document.data()?.username ?? `User ${Math.random()}`;
  if(id === undefined){throw "User ID doesn't exist";}
  return {"userID": id, "largestStreak": streak, "username": username, "docReference": document.id};
}

export async function logIn(username: string, password: string): Promise<void>{
  const {user: {uid: uidString}}: UserCredential = await signInWithEmailAndPassword(auth, username, password);
  const {docs}: QuerySnapshot = await getDocs(query(collection(database, collectionName), where("userID", "==", uidString)));
  if(docs.length > 0){
    userDoc = parseDoc(docs[0]);
    return Promise.resolve();
  }
  const {id} = await addDoc(collection(database, collectionName), {
    "userID": uidString,
    "largestStreak": 0,
    "username": `User ${Math.random()}`
  } as PlayerAttributes);
  userDoc = {"userID": uidString, "largestStreak": 0, "username": `User ${Math.random()}`, "docReference": id};
  return Promise.resolve();
}

export async function signOutUser(): Promise<void>{return signOut(auth);}

export function registerStreak(newStreak: number): boolean{
  if(userDoc === null){throw "UserDoc not initialized";}
  const streak: number = userDoc.largestStreak;
  if(streak >= newStreak){return false;}
  updateAttributes({attribute: "largestStreak", value: newStreak});
  return true;
}

export function getUserAttributes(): PlayerAttributes{
  if(userDoc === null){throw "User Doc is not defined";}
  const copy = {...userDoc};
  return copy;
}

type attributeValuePair<T extends keyof PlayerAttributes> = {
  attribute: T,
  value: PlayerAttributes[T],
}

function updateAttributes<T extends keyof PlayerAttributes>(...pairs: attributeValuePair<T>[]):void{
  if(userDoc === null){throw "User doc not initialized";}
  const newObject = {...userDoc};
  for(let i: number = 0; i < pairs.length; i++){newObject[pairs[i].attribute] = pairs[i].value;}
  userDoc = newObject;
  console.log(userDoc.largestStreak);
  const {userID, largestStreak, username} = userDoc;
  updateDoc(doc(database, collectionName, userDoc.docReference), {
    userID: userID,
    largestStreak: largestStreak,
    userDoc: userDoc
  }).catch(function(error){console.log(error.message);});
}

export async function getTopScorers(numMax: number): Promise<PlayerAttributes[]>{
  const {docs}: QuerySnapshot = await getDocs(query(collection(database, collectionName), orderBy("largestStreak"), limit(numMax)));
  const array: PlayerAttributes[] = [];
  for(let i = 0; i < docs.length; i++){
    array.push(parseDoc(docs[i]));
  }
  return Promise.resolve(array);
} 