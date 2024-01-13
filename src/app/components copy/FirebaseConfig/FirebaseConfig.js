// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

function FirebaseConfig() {
  const firebaseConfig = {
    apiKey: "AIzaSyAymUWsg-UwyeX7h9giwXMxfUJui6f18ag",
    authDomain: "iot-home-eb9ad.firebaseapp.com",
    databaseURL: "https://iot-home-eb9ad-default-rtdb.firebaseio.com",
    projectId: "iot-home-eb9ad",
    storageBucket: "iot-home-eb9ad.appspot.com",
    messagingSenderId: "44162377113",
    appId: "1:44162377113:web:2f2f9fc3408caa4e88df08",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return getDatabase(app);
}

export default FirebaseConfig;
