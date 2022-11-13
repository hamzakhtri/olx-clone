import { getChatroom, getActiveUser } from "../firebase/firebase.js";



// getting current user id to get him chat from the firebase 


let urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("id");

// getting current user credentials to match the name and show his name to the profile card 

const userObj = await getActiveUser(userId);

// getting chatroom data from the firebase function 

const chatroomData = await getChatroom(userId);

// printing the chat room data to the chatrrom page 

const chatroomSec = document.getElementById("chatroom-card-sec");
const chatSecHeading = document.getElementById("chatPage-heading");
      chatroomSec.innerHTML = "";

      if(chatroomData.length == 0){
        chatSecHeading.innerHTML = `<h1 class="text-center display-1">No Chats To Show</h1>`
    }else{
        chatSecHeading.innerHTML = `<h1 class="text-center display-3">Your Chats</h1>`

        for(let item of chatroomData){

            let name;
            if(userObj.name == item.users.user1Name){
                name = item.users.user2Name;
            }else{
                name = item.users.user1Name;
            }
            const htmlCard = `<div class="col-md-6">
                                <div class="d-flex flex-row border rounded shadow">
                                <div class="p-0 w-25">
                                    <img src="../IMG/avatar.png" class="img-thumbnail border-0">
        
                                </div>
                                <div class="pl-3 pt-2 pr-2 pb-2 w-75 border-left">
                                    <h4 class="text-primary">${name}</h4>
                                    <h5 class="text-info">Your Chats</h5>
                                    <p class="text-right m-0"><button class="btn btn-primary" onclick="openChat('${item.id}')"><i
                                        class="far fa-user"></i>Open Chat</button></p>
                                </div>
                                </div>
                            </div>`;
            chatroomSec.innerHTML+= htmlCard;
        }

    }



window.openChat = function(chatRoomId){
   window.location.href=`../chat/chat.html?id=${chatRoomId}`;
}