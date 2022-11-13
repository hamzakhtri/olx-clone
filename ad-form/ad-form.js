// importing firebase function from firebase.js that use to store the ad's detail 

import { postAdToDb, uploadImage } from "../firebase/firebase.js";


window.adPost = async function () {

    const title = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const desc = document.getElementById("product-desc").value;
    const image = document.getElementById("product-img").files[0];


    try{
        const imageURL = await uploadImage(image);
        await postAdToDb({title, price, desc, imageURL});
        alert("SuccessFully Ad Posted");
        window.location.href = "../index.html";
    }catch(e){
        console.log("error ", e.message);
    }

}

