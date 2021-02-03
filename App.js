import "react-native-gesture-handler";
import ChallengeDetailsScreen from "./src/screens/ChallengeDetailsScreen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import HomePage from "./src/screens/HomePage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PersonalChallengesScreen from "./src/screens/PersonalChallengesScreen";
import FriendChallengesScreen from "./src/screens/FriendChallengesScreen";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomePage" component={HomePage} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
