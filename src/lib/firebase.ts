
// import { initializeApp } from "firebase/app";
 import { getAuth } from "firebase/auth";

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDJaZtF57Sr1t8KNkiPnX2yLMCc_JHQ9R0",
//   authDomain: "jobathon-app.firebaseapp.com",
//   projectId: "jobathon-app",
//   storageBucket: "jobathon-app.appspot.com",
//   messagingSenderId: "123456789012",
//   appId: "1:123456789012:web:abcdef1234567890abcdef"
//   // Note: Replace these with your actual Firebase config values
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication
// export const auth = getAuth(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDtoX9WlLOVsqAPTvO9_B_KHkGGr6YI2s",
  authDomain: "jobathon-7839b.firebaseapp.com",
  projectId: "jobathon-7839b",
  storageBucket: "jobathon-7839b.firebasestorage.app",
  messagingSenderId: "73977791409",
  appId: "1:73977791409:web:8b22f18b10d49a887eb390",
  measurementId: "G-JR5WGTK6PD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//export default app;
 export const auth = getAuth(app);