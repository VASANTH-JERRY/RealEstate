// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
//   apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  apiKey:"AIzaSyA4uBiv3PuKaHCbm-Vsfglg0zHs9xCtHBQ" ,

  authDomain: "estate-b700a.firebaseapp.com",
  projectId: "estate-b700a",
  storageBucket: "estate-b700a.appspot.com",
  messagingSenderId: "608918224605",
  appId: "1:608918224605:web:aa2c3b129e6bc88f23a534"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const storage = getStorage(app);
// const analytics = getAnalytics(app);
export { app, auth };

// export default app;