import { initializeApp, database as _database } from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBDYwophwYQ4SDi-TKg-EWb6QfipA2LSaU",
  authDomain: "pttk-hdt.firebaseapp.com",
  databaseURL: "https://pttk-hdt-default-rtdb.firebaseio.com",
  projectId: "pttk-hdt",
  storageBucket: "pttk-hdt.appspot.com",
  messagingSenderId: "695339930477",
  appId: "1:695339930477:web:10da8a71c8d8d61d734064",
  measurementId: "G-C98CBSKK25"
};

initializeApp(firebaseConfig);
const database = _database();
export default database;