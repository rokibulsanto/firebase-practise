import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import { configure } from '@testing-library/react';
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const [user,setUser] = useState({
    isSignIn:'false',
    name:'',
    email:'',
    photo:''

  })

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName,email,photoURL} = res.user;
      const signInUser = {

        isSignIn:'true',
        name:displayName,
        email:email,
        photo:photoURL

      }
      setUser(signInUser);
     
    })
    .catch(err =>{
      console.log(err);
    })
  }

  const handleSignOut = ()=> {
    firebase.auth().signOut()
    .then(res => {
      const signOutUser = {
        isSignIn:'false',
        name:'',
        email:'',
        photo:''

      }
      setUser(signOutUser);
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="App">
   {
      user.isSignIn ? <button onClick={handleSignOut}>Sign-Out</button> : 
      <button onClick={handleSignIn}>Sign-in</button>

   }
      
    
      {
        user.isSignIn && <div>
          <p>Welcome,{user.name} </p>
          <p>Your email {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;
