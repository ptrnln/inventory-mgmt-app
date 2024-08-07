// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCOKtAXMbHih4DNkZXjSskA6SizMFwX0QA",
//   authDomain: "inventory-management-app-faf59.firebaseapp.com",
//   projectId: "inventory-management-app-faf59",
//   storageBucket: "inventory-management-app-faf59.appspot.com",
//   messagingSenderId: "179408992574",
//   appId: "1:179408992574:web:bb4efae7ae7c941f76146f",
//   measurementId: "G-09H9TVQYCF"
// };
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.HOST,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.GOOGLE_ANALYTICS_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? isSupported(getAnalytics(app)): null;
const firestore = getFirestore(app);
export { firestore, analytics };