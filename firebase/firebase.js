// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, getDoc, query, where, onSnapshot  } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-storage.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbWe3O9AMusF9SCBKuBieuEeuZWzWXj_8",
  authDomain: "cheap-olx.firebaseapp.com",
  projectId: "cheap-olx",
  storageBucket: "cheap-olx.appspot.com",
  messagingSenderId: "101692472469",
  appId: "1:101692472469:web:9b7f6549d6a5fff33c2f9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


//firebase signin function

function signinFirebase(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// firebase sign up function 

async function signupFirebase(userinfo) {
  const { email, password } = userinfo;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await addUserToDb(userinfo, userCredential.user.uid);
  console.log(auth);
}

// adding user credential to the firebase

function addUserToDb(userinfo, uid) {
  const { name, email, phone } = userinfo;
  return setDoc(doc(db, "users", uid), ({ name, email, phone }))

}

// post ad functio by using firebase addDoc function


function postAdToDb(adDetail) {
  const { title, price, desc, imageURL } = adDetail;
  const userId = auth.currentUser.uid;
  return addDoc(collection(db, "ads"), { title, price, desc, imageURL, userId });

}

async function getAds() {
  const querySnapshot = await getDocs(collection(db, "ads"));
  let ads = []
  querySnapshot.forEach((doc) => {
    // console.log(doc.data());
    ads.unshift({ id: doc.id, ...doc.data() });
  });
  return ads
}

// upload image to the firebase storage and gettnig thr urrl of the image

async function uploadImage(image) {
  const storageRef = ref(storage, `images/${Date.now()}.jpg`);
  const snapshot = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

// getting the active user Credential 

async function getActiveUser(userId) {
  const docRef = doc(db, "users", userId);
  const logedUser = await getDoc(docRef);
  return logedUser.data();
}

// on read more button click showing the detail page and detail of the desired product

async function getDetailPage(adId) {
  const docRef = doc(db, "ads", adId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

// check chat room function 

async function checkChatRoom(sellerId) {
  const userId = auth.currentUser.uid;

  const q = await query(collection(db, "chatroom"),
  where(`users.${userId}`, "==", true), where(`users.${sellerId}`, "==", true));

  const querySnapshot = await getDocs(q);

  let room;

  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    room = {id: doc.id, ...doc.data()};
  });

  return room;

}

// create chatrooom collection in firebase 

async function createChatroom(sellerId){

  let userId = auth.currentUser.uid;

  const user1 = await getActiveUser(sellerId);
  const user2 = await getActiveUser(userId);

  const obj = {
    users:{
      [userId]: true,
      [sellerId]: true,
      user1Name : user1.name,
      user2Name : user2.name
    },

    createdAt: Date.now()
  }

  return addDoc(collection(db, "chatroom"), obj);

}

async function sendMessageToDb(text, roomId){

  const senderDetal = await getActiveUser(auth.currentUser.uid);

  var messageId = roomId + Date.now();
  const message = {name : senderDetal.name , text, createdAt : Date.now() , userId : auth.currentUser.uid};
  return setDoc(doc(db, "chatroom", `${roomId}`, "messages", `${messageId}`), message);

}

// get message 


function getRealtimeChat(callback) {

  let urlParams = new URLSearchParams(window.location.search);
    let roomId = urlParams.get("id");

  onSnapshot(collection(db, `chatroom/${roomId}/messages`), (querySnapshot) => {
      const chats = [];

      querySnapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      callback(chats);
  })
}


// getting and chatroom to show on the chatroom page 


async function getChatroom(userId){
  const q = query(collection(db, "chatroom"), where(`users.${userId}`, "==", true));

  const querySnapshot = await getDocs(q);
  let chatrooms = []
  querySnapshot.forEach((doc) => {
    // console.log(doc.data());
    chatrooms.push({ id: doc.id, ...doc.data() });
  });
  return chatrooms
}




export {
  signupFirebase,
  signinFirebase,
  postAdToDb,
  getAds,
  uploadImage,
  getActiveUser,
  getDetailPage,
  checkChatRoom,
  createChatroom,
  sendMessageToDb,
  getRealtimeChat,
  getChatroom

}