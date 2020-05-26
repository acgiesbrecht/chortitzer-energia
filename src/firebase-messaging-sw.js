importScripts("https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyBrqD5uCpHePfibhlTkSKeH1fui2ywxvDk",
  authDomain: "chortitzer-energia.firebaseapp.com",
  databaseURL: "https://chortitzer-energia.firebaseio.com",
  projectId: "chortitzer-energia",
  storageBucket: "chortitzer-energia.appspot.com",
  messagingSenderId: "252889164504",
  appId: "1:252889164504:web:260d50a5c251cbc2eb85ad",
  measurementId: "G-BS80PX6Z4P",
});
const messaging = firebase.messaging();
