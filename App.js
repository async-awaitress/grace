import "react-native-gesture-handler";
import ChallengeDetailsScreen from "./src/screens/ChallengeDetailsScreen";
import ChallengeListScreen from "./src/screens/ChallengeListScreen";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomePage from './HomePage';
// import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'
import MockChallenges from './MockChallenges';
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import Login from './src/screens/LoginScreen';
import Registration from './src/screens/RegistrationScreen';


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
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="MockChallenges" component={MockChallenges} />
        <Stack.Screen
          name="Challenge Details"
          component={ChallengeDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}



