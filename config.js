import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyDEpbcDl9Yc5tDNAYTr6i6x32QRqmuT-Jw",
  authDomain: "story-hub-68046.firebaseapp.com",
  databaseURL: "https://story-hub-68046.firebaseio.com",
  projectId: "story-hub-68046",
  storageBucket: "story-hub-68046.appspot.com",
  messagingSenderId: "490732138977",
  appId: "1:490732138977:web:7ea326ed534f56e83c62a0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
