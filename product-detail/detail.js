// Import the functions you need from the SDKs you need
import { getDetailPage, checkChatRoom, createChatroom } from '../firebase/firebase.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";

const auth = getAuth()


// Initialize Firebase


let urlParams = new URLSearchParams(window.location.search);
let adId = urlParams.get("id");
console.log(adId);


let postData = await getDetailPage(adId);



// print the detail of the product



const detailTitle = document.getElementById("detail-title");
const detailPrice = document.getElementById("detail-price");
const detailImg = document.getElementById("detail-img");
const detailDesc = document.getElementById("detail-desc");
const detailRating = document.getElementById("detail-rating");
const ratingPoint = document.getElementById("rating-point");
const ratingImg = document.getElementById("rating-img");

detailTitle.innerHTML = postData.title;
detailPrice.innerHTML = postData.price;
detailImg.src = postData.imageURL;
detailDesc.innerHTML = postData.desc;
detailRating.innerHTML = "Rating:";
ratingImg.src = "../IMG/star-rating.png";
ratingPoint.innerHTML = "5.0";



// initiating chatrrom 


window.initiateChat = async function () {

  onAuthStateChanged(auth, async (user) => {
    if (user) {

      // chekcing user's chat room available or not
      let chatRoom = await checkChatRoom(postData.userId);
      let sellerId = postData.userId;
      let logedUserId = auth.currentUser.uid;

      if (sellerId == logedUserId) {
        alert("It's Your Own Post");
      } else {
        if (!chatRoom) {
          chatRoom = await createChatroom(sellerId);
          alert("chatRoom successfully created");
        } else {
          alert("chatRoom exists");
        }

        const chatRoomId = await chatRoom.id;

        window.location.href = `../chat/chat.html?id=${chatRoomId}`;
      }



      // ...
    } else {
      alert("Please Login Or Register First");
      window.location.href = "../users/auth.html";

    }
  });



}

window.goToChatroom = function () {
  const userId = auth.currentUser.uid;
  window.location.href = `../chatroom/chatRoom.html?id=${userId}`;
}
