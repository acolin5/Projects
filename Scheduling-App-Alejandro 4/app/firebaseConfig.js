import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyDJ5GGgcd2m5ksD54IvzViCQT2TM2NpkdI",
    authDomain: "timeon-46566.firebaseapp.com",
    databaseURL: "https://timeon-46566-default-rtdb.firebaseio.com",
    projectId: "timeon-46566",
    storageBucket: "timeon-46566.appspot.com",
    messagingSenderId: "246190236672",
    appId: "1:246190236672:web:6f678500f670e7119364e5",
    measurementId: "G-PSVJREND29"
  };

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth, analytics };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
