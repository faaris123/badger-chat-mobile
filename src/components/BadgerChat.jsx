import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from "./screens/BadgerLogoutScreen"
import BadgerConversionScreen from "./screens/BadgerConversionScreen"

const ChatDrawer = createDrawerNavigator();

export default function App() {
  // Added state variable for the guest session
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false)

  // Used mostly HW6 code to do this portion

  // Copied from HW6
  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/chatrooms", {
      method: "GET",
      headers: {
        "X-CS571-ID": "bid_847d09ed085dacaedc451fd225893d7a6d17095344e4ca85c2843d44093da7cb",
      }
    })
    .then(res => res.json()).then(json => {
      setChatrooms(json)
    })
    //setChatrooms(["Hello", "World"]) // for example purposes only!
  }, []);

  // Fetch from API per instructions and save the JWT and username in SecureStorage
  // Also copied from previous HW
  // Check the JSON for the appropriate message otherwise Alert the user that something has gone wrong 
  // Save the username in addition to the JWT in order to determine if a user is the owner of a post 
  function handleLogin(username, pin) {
    // hmm... maybe this is helpful!
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CS571-ID": "bid_847d09ed085dacaedc451fd225893d7a6d17095344e4ca85c2843d44093da7cb",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        pin: pin
      }),
    })
    .then(res => res.json()).then(json => {
      if (json.msg === "Successfully authenticated.") {
        Alert.alert("Login Succesful")
        SecureStore.setItem("JWT", json.token)
        SecureStore.setItem("username", username)
        setIsLoggedIn(true)
        setIsGuest(false)
      }
      else {
        Alert.alert("Incorrect login, please try again.")
      }
    })
    // I should really do a fetch to login first!
  }

  // Same logic as handleLogin
  // Set guest to false in case user starts a guest session and then decides to sign up 
  function handleSignup(username, pin) {
    // hmm... maybe this is helpful!
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CS571-ID": "bid_847d09ed085dacaedc451fd225893d7a6d17095344e4ca85c2843d44093da7cb",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        pin: pin
      }),
    })
    .then(res => res.json()).then(json => {
      if (json.msg === "Successfully authenticated.") {
        Alert.alert("Registration Successful!")
        SecureStore.setItemAsync("JWT", json.token)
        SecureStore.setItem("username", username)
        setIsLoggedIn(true)
        setIsGuest(false)
      }
      else {
        Alert.alert("Username has been taken!")
      }
    })

    // I should really do a fetch to register first!
  }

  // Added some new logic to this portion
  // If the user is logged or a guest they will see the other screens
  // If they aren't a guest they see logout
  // If they are a guest they see signup
  // Passed down appropriate functions and variables as props
  if (isLoggedIn || isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} isGuest={isGuest}/>}
              </ChatDrawer.Screen>
            })
          }
          {isGuest === false && <ChatDrawer.Screen name="Logout">
            {(props) => <BadgerLogoutScreen setIsLoggedIn={setIsLoggedIn} setIsRegistering={setIsRegistering}/>}
          </ChatDrawer.Screen>}
          {isGuest === true && <ChatDrawer.Screen name="Signup">
            {(props) => <BadgerConversionScreen setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>}  
          </ChatDrawer.Screen>}
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>
  }
}
