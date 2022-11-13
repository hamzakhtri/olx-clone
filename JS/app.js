import { getAds, getActiveUser } from "../firebase/firebase.js";
import { getAuth, onAuthStateChanged,  signOut} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";

  // Your web app's Firebase configuration



// printing the active user detail to home page

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
    if (user) {
      const currentUser = await getActiveUser(auth.currentUser.uid);
      const profileSec = document.getElementById("profile-sec");
      const profileHtml = `<div id="profile-html"><h4>${currentUser.name}</h4>
                               <button class="btn btn-primary" id="logout" onclick="logout()">Logout</button>
                           </div>`
      profileSec.innerHTML = profileHtml;
      const chatBtn = document.getElementById("chatPage");
      chatBtn.style.display="block";


      // ...
    } else {
        const loginBtn = document.getElementById("header-login");
        loginBtn.style.display="block";
    }
  });



  // logout user on logut btn click 

  window.logout = function() {
    signOut(auth).then(() => {
      alert("Logout Successfully");
      window.location.href="../index.html"
    }).catch((error) => {
      console.log(error.messagingSenderId)
    });
  }


// on login button click redirect to the sign up or login page

let loginBtn = document.getElementById("header-login");
loginBtn.addEventListener("click", function () {
    window.location.href = "../users/auth.html";
});

// on sell button click redirect to the ad form page

let sellBtn = document.getElementById("selling-btn");
sellBtn.addEventListener("click", function () {

    // check the user have loded in or not if user is not loged in so redirect user to the auth.html

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            window.location.href = "../ad-form/ad-form.html";
          // ...
        } else {
            alert("Please Login Or Register First");
            window.location.href = "../users/auth.html";

        }
      });

});

// showing ads to the main screen

var postSection = document.getElementById("post-section");
postSection.innerHTML = "";

window.showAds = async function () {
    postSection.innerHTML = "";

    try {
        const ads = await getAds()
        if (ads.length == 0) {
            console.log("No Ads To Show")
            postSection.innerHTML = `<h1 style="margin: 0 auto;" class="display-4">No Ads To Show</h1> `
        }
        // console.log(ads[1])
        for (let i = 0; i < ads.length; i++) {
            var PostCard = ` <div class="card col-lg-6 col shadow" onclick="goToDetail('${ads[i].id}')">
                              <div class="card-img-top card-img">
                              <span class="badge badge-warning bg-primary text-light featured-badge">Featured</span>
                              <img src=${ads[i].imageURL}>
                              </div>
                              <div class="card-body">
                              <h5 class="card-title">${ads[i].title}</h5>
                              <h6 class="card-title">Rs ${ads[i].price}</h6>
                              <p class="card-text text-secondary">${ads[i].desc}</p>
                              <button onclick="goToDetail('${ads[i].id}')" class="btn btn-lg btn-primary w-100" style="background-color: #3737f3;">Read More</button>
                              </div>
                              <span class="yellow-strip"></span>
                          </div>`;
            postSection.innerHTML += PostCard;
        }
    }
    catch (e) {
        console.log(e.message)
    }
}


// on readmore button click redirecting to the detail page of the product

window.goToDetail  = async function(adId){
  location.href = `../product-detail/detail.html?id=${adId}`;
}


// got chatroom on header chatroom btn click 


window.goToChatroom = function(){
  const userId = auth.currentUser.uid;
  window.location.href = `../chatroom/chatRoom.html?id=${userId}`;
}
