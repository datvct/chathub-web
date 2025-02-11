import { initializeApp } from "firebase/app"
import { getAuth, signInWithPhoneNumber } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf4dMcVRIKMDb6L_KQWtDoRG6L8nvtqfU",
  authDomain: "chathub-215d7.firebaseapp.com",
  projectId: "chathub-215d7",
  storageBucket: "chathub-215d7.firebasestorage.app",
  messagingSenderId: "964645860857",
  appId: "1:964645860857:web:2211c7f74d3c0daeecf928",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
auth.useDeviceLanguage()

export { auth, signInWithPhoneNumber }
