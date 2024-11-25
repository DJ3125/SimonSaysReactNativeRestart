import {initializeApp, FirebaseApp} from "firebase/app";
import {getFirestore, collection, addDoc, Firestore, query, where, DocumentData, getDocs, QuerySnapshot, updateDoc, doc} from "firebase/firestore";
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

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Firestore = getFirestore(app);

let userDoc: DocumentData | null = null;

export async function logIn(username: string, password: string): Promise<void>{
  const promise = signInWithEmailAndPassword(auth, username, password);
  promise.then(function({user: uid}: UserCredential){
    getDocs(query(collection(database, "Users"), where("UserID", "==", uid))).then(function(snap: QuerySnapshot){
      const docs = snap.docs;
      if(docs.length > 0){
        userDoc = docs[1];
        return;
      }
      addDoc(collection(database, "Users"), {
        "UserID": uid,
        "Streak": 0,
      }).then(function(doc: DocumentData){
        userDoc = doc;
      });
    });
  });
  return new Promise(function(resolve, reject){promise.then(()=>resolve(), ()=>reject());});
}

export function getCurrentUser(): User{
  if(auth.currentUser === null){throw "Current User Is Null";}
  return auth.currentUser;
}

export function signOutUser(): void{
  signOut(auth).catch(function(error){
    console.log(error);
  });
}

export function registerStreak(newStreak: number): void{
  if(userDoc === null){throw "UserDoc not initialized";}
  const streak: number = userDoc.data()?.Streak ?? 0;
  if(streak >= newStreak){return;}
  updateDoc(doc(database, "Users", getCurrentUser().uid), {"Streak": newStreak});
}