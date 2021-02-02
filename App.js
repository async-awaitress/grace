import "react-native-gesture-handler";
import ChallengeDetailsScreen from "./src/screens/ChallengeDetailsScreen";
import ChallengeListScreen from "./src/screens/ChallengeListScreen";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'
import MockChallenges from './MockChallenges';
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import HomePage from "./src/screens/HomePage";
// import ChallengeListScreen from "./src/screens/ChallengeListScreen";



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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="MockChallenges" component={MockChallenges} />
        <Stack.Screen
          name="Challenge Details"
          component={ChallengeDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}



