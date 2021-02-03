import "react-native-gesture-handler";
import ChallengeDetailsScreen from "./src/screens/ChallengeDetailsScreen";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import HomePage from "./src/screens/HomePage";
import AuthScreen from "./src/screens/AuthScreen"
import HomeScreen from "./src/screens/HomeScreen"
// import ChallengeListScreen from "./src/screens/ChallengeListScreen";
import PersonalChallengesScreen from "./src/screens/PersonalChallengesScreen";
import FriendChallengesScreen from "./src/screens/FriendChallengesScreen";
// import LoadingScreen from "./src/screens/LoadingScreen"

const Stack = createStackNavigator();

export default function App() {

  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (

    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Challenge List" component={ChallengeListScreen} /> */}
        {/* <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }}/> */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GoogleSignIn" component={AuthScreen}/>
        <Stack.Screen
          name="Personal Challenges"
          component={PersonalChallengesScreen}
        />
        <Stack.Screen
          name="Friend Challenges"
          component={FriendChallengesScreen}
        />
        <Stack.Screen
          name="Challenge Details"
          component={ChallengeDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}



