import {initializeApp, FirebaseApp} from "firebase/app";
import {getFirestore, collection, addDoc, Firestore, query, where, QueryDocumentSnapshot, getDocs, QuerySnapshot, updateDoc, doc} from "firebase/firestore";
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

interface PlayerAttributes {
  "userID": string,
  "largestStreak": number,
  "username": string,
}

function parseDoc(document: QueryDocumentSnapshot): PlayerAttributes{
  if(document === null || document === undefined){throw "Doc is undefined";}
  const id: string = document.data()?.userID;
  const streak: number = document.data()?.largestStreak ?? 0;
  const username: string = document.data()?.username ?? `User ${Math.random()}`;
  if(id === undefined){throw "User ID doesn't exist";}
  return {"userID": id, "largestStreak": streak, "username": username};
}

export async function logIn(username: string, password: string): Promise<void>{
  const {user: {uid: uidString}}: UserCredential = await signInWithEmailAndPassword(auth, username, password);
  const {docs}: QuerySnapshot = await getDocs(query(collection(database, collectionName), where("userID", "==", uidString)));
  if(docs.length > 0){
    userDoc = parseDoc(docs[0]);
    return Promise.resolve();
  }
  addDoc(collection(database, collectionName), {
      "userID": uidString,
      "largestStreak": 0,
      "username": `User ${Math.random()}`
    } as PlayerAttributes);
  userDoc = {"userID": uidString, "largestStreak": 0, "username": `User ${Math.random()}`};
  return Promise.resolve();
}

function getCurrentUser(): User{
  if(auth.currentUser === null){throw "Current User Is Null";}
  return auth.currentUser;
}

export function signOutUser(): void{
  signOut(auth).catch(function(error){
    throw error;
  });
}

export function registerStreak(newStreak: number): void{
  if(userDoc === null){throw "UserDoc not initialized";}
  const streak: number = userDoc.largestStreak;
  if(streak >= newStreak){return;}
  updateAttributes({attribute: "largestStreak", value: newStreak});
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
  updateDoc(doc(database, collectionName, getCurrentUser().uid), newObject);
}
