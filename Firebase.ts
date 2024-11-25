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

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Firestore = getFirestore(app);

let userDoc: PlayerAttributes | null = null;

interface PlayerAttributes {
  "userID": string,
  "largestStreak": number,
}

function parseDoc(document: QueryDocumentSnapshot): PlayerAttributes{
  if(document === null || document === undefined){throw "Doc is undefined";}
  const id: string = document.data()?.userID;
  const streak: number = document.data()?.largestStreak ?? 0;
  if(id === undefined){throw "User ID doesn't exist";}
  return {"userID": id, "largestStreak": streak};
}

export async function logIn(username: string, password: string): Promise<void>{
  const promise = signInWithEmailAndPassword(auth, username, password);
  promise.then(function({user: {uid: uidString}}: UserCredential){
    console.log("docs");
    getDocs(query(collection(database, "Users"), where("userID", "==", uidString))).then(function(snap: QuerySnapshot){
      const docs = snap.docs;
      console.log(docs);
      if(docs.length > 0){
        userDoc = parseDoc(docs[0]);
        return;
      }
      addDoc(collection(database, "Users"), {
        "userID": uidString,
        "largestStreak": 0,
      } as PlayerAttributes).then(function(){
        userDoc = {"userID": uidString, "largestStreak": 0};
      }).catch(function(error){
        console.log(error.message);
      });
    }).catch(function(error){
      console.log(error.message);
    });
  }).catch(function(error){console.log(error.message);});
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
  const streak: number = userDoc.largestStreak;
  if(streak >= newStreak){return;}
  userDoc.largestStreak = newStreak;
  updateDoc(doc(database, "Users", getCurrentUser().uid), {"largestStreak": newStreak});
}

export function getLargestStreak(): number{
  if(userDoc === null){throw "User Doc is not defined";}
  return userDoc.largestStreak;
}