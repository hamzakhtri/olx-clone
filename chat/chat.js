import{sendMessageToDb, getRealtimeChat} from "../firebase/firebase.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";

const auth = getAuth();


// getting the room id from the param 


// send message to the firebase function 

let urlParams = new URLSearchParams(window.location.search);
    let roomId = urlParams.get("id");

window.sendMsg = async function(){
    const message = document.getElementById("messageField");
    await sendMessageToDb(message.value, roomId);
    message.value = "";

}


    
function getChatMessages(){
    getRealtimeChat((messages)=>{
        const chatbox = document.getElementById("messagesElem");

        chatbox.innerHTML = ''
        for(let item of messages){

            var backcolor;
            var timestamp;
            if(item.userId === auth.currentUser.uid){
                backcolor = "success"
                timestamp= "right"
            }
            else{
                backcolor = "warning"
                timestamp = "left"
            }
            chatbox.innerHTML += `  <div class="bg-${backcolor} rounded">
            <div class="text-${timestamp} p-2">
             <span class="sender-name pr-3" style="font-size: 18px;">${item.name} </span>
              <small>${new Date(item.createdAt).toLocaleTimeString()}</small>
              </div>
            <p class="text-${timestamp} h5 p-2">${item.text}</p>
        </div>`;

        // scrolling down the scroll "user do not have to scroll down to see msg "
        
        var objDiv = document.getElementById("chat-section");
        objDiv.scrollTop = objDiv.scrollHeight;
        }
    })


}



getChatMessages();