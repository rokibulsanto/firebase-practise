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
  const [newUser,setNewUser] = useState(false);
  const [user,setUser] = useState({
    isSignIn: false,
    name:'',
    email:'',
    password:'',
    photo:''

  })

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName,email,photoURL} = res.user;
      const signInUser = {

        isSignIn: true,
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
        isSignIn: false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false

      }
      setUser(signOutUser);
    })
    .catch(err => {
      console.log(err);
    })
  }
const handleBlur = (e) => {
  let isFieldValid = true;
  if(e.target.name === 'email'){
    isFieldValid =  /\S+@\S+\.\S+/.test(e.target.value);
   
  }
  if(e.target.name === 'password'){
    const isPasswordValid = e.target.value.length > 6;
    const isPasswordHasNumber = /\d{1}/.test(e.target.value);
     isFieldValid= isPasswordValid && isPasswordHasNumber;
  }
  if(isFieldValid){
    const newUserInfo = {...user};
    newUserInfo[e.target.name] = e.target.value;
    setUser(newUserInfo);
  }
}
const handleSubmit = (e) => {
  if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      updateUserName(user.name);
      
    })
    .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error =error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
    });
  }
  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      console.log('sign in user info',res.user);
    })
    .catch(function(error) {
      const newUserInfo = {...user};
        newUserInfo.error =error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
    });
  }

  e.preventDefault();
}
 const updateUserName = name => {
      const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name
      }).then(function() {
        console.log('userName update successfully');
      }).catch(function(error) {
        console.log(error);
      });
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

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">NewUser sign-up</label>
  
      <form onSubmit={handleSubmit}>        
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your password" required />
        <br/>
        <input type="submit" value={newUser ? 'Sign up': 'Sign in'}/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {
        user.success && <p style = {{color:'green'}}>User {newUser ?'created' : 'Logged In'} successfully</p>
      }
    </div>
  );
}

export default App;
