console.info('loading from background js');

var firebaseConfig = {
    apiKey: "AIzaSyC861X0Y91tM26u8Os3fsZr1JWZkdka9kA",
    authDomain: "codehs-extension.firebaseapp.com",
    databaseURL: "https://codehs-extension.firebaseio.com",
    projectId: "codehs-extension",
    storageBucket: "codehs-extension.appspot.com",
    messagingSenderId: "15084628004",
    appId: "1:15084628004:web:6ec1669b9ca7b2f3d610b1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();