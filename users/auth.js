// importing authentication function from firebase.js file 

import {signinFirebase, signupFirebase} from "../firebase/firebase.js";


// showing the signup form on sign up text click if user want to register

let loginScreen = document.getElementById("login-screen");
let signupScreen = document.getElementById("signup-screen");

let showSignup = document.getElementById("show-signup-sc");
showSignup.addEventListener("click", function(){
    signupScreen.style.display="block";
    loginScreen.style.display="none";
})

let showLogin = document.getElementById("show-login-sc");

showLogin.addEventListener("click", function(){
    signupScreen.style.display="none";
    loginScreen.style.display="block";
});

// signup user by firebase function 

window.signup = async function(){

    // getting user data from input 

    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const phone = document.getElementById("userPhone").value;
    const password = document.getElementById("userPsw").value;

    // calling the firebase signup function 

    try{
        await signupFirebase({name, email, phone, password});
        alert("Successfully Registered");
    }catch(e){
        alert(e.message);
    }

    signupScreen.style.display="none";
    loginScreen.style.display="block";

}

// signin user by firebase function 

window.signin = async function(){

    // getting user email and password from the field

    const email = document.getElementById("regis-email").value;
    const password = document.getElementById("regis-psw").value;

    try{
        await signinFirebase(email, password);
        alert("Successfully Signed In");
        window.location.href="../index.html";
        
    }catch(e){
        alert(e.message);
    }

}


