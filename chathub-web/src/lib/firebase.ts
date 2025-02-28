import { initializeApp } from "firebase/app"
import { getAuth, signInWithPhoneNumber } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqbK1-_Gzwb6jH6PR8tsrWrl1esCODY90",
  authDomain: "chathubstaging.firebaseapp.com",
  projectId: "chathubstaging",
  storageBucket: "chathubstaging.firebasestorage.app",
  messagingSenderId: "1025131653518",
  appId: "1:1025131653518:web:c92a72e6e639e87531dcdf",
  measurementId: "G-CLQKSF6LDH"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
auth.useDeviceLanguage()

export { auth, signInWithPhoneNumber }
