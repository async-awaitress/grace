import "react-native-gesture-handler";
import ChallengeDetailsScreen from "./src/screens/ChallengeDetailsScreen";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as firebase from "firebase";
import apiKeys from "./config/keys";
import LoginScreen from "./src/screens/LoginScreen";
import RegistrationScreen from "./src/screens/RegistrationScreen";
import HomePage from "./src/screens/HomePage";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PersonalChallengesScreen from "./src/screens/PersonalChallengesScreen";
import FriendChallengesScreen from "./src/screens/FriendChallengesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Friends from "./src/screens/Friends";
import { Provider } from "react-redux";
import ChallengeTrackerScreen from "./src/screens/ChallengeTrackerScreen";
import FriendsIcon from "./src/screens/Icons/FriendsIcon";
import UserIcon from "./src/screens/Icons/UserIcon";
import HomeIcon from "./src/screens/Icons/HomeIcon";

const Stack = createStackNavigator();
const ChallengeStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

//nav between home, challenge list, details
// const ChallengeScreenNav = () => (
//   <ChallengeStack.Navigator
//     initialRouteName="Home"
//     screenOptions={{
//       title: "",
//       headerBackAllowFontScaling: true,
//       headerBackTitleStyle: {
//         fontSize: 16,
//       },
//       headerTransparent: true,
//       headerTintColor: "white",
//     }}
//   >
//     <ChallengeStack.Screen
//       name="Home"
//       component={HomePage}
//       options={{
//         title: "",
//       }}
//     />
//     <ChallengeStack.Screen
//       name="Browse Challenges"
//       component={PersonalChallengesScreen}
//       options={{ title: "" }}
//     />
//     <ChallengeStack.Screen
//       name="Challenge Details"
//       component={ChallengeDetailsScreen}
//       options={{ title: "" }}
//     />
//   </ChallengeStack.Navigator>
// );

//bottom nav bar
const TabsScreenNav = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Profile") {
          iconName = "user";
        } else if (route.name === "Friends") {
          iconName = "users";
        }
        color = focused ? "#9FC78A" : "#8688BC";
        return <Feather name={iconName} size={20} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: "#9FC78A",
      inactiveTintColor: "#8688BC",
    }}
  >
    {/* <Tabs.Screen name="Challenges" component={ChallengeScreenNav} /> */}
    <Tabs.Screen
      name="Home"
      component={HomePage}
      options={{
        tabBarIcon: ({ focused, color }) => {
          color = focused ? "#9FC78A" : "#8688BC";
          return (
            <>
              <HomeIcon focused={focused} />
            </>
          );
        },
      }}
    />
    <Tabs.Screen
      name="Friends"
      component={Friends}
      options={{
        tabBarIcon: ({ focused, color }) => {
          color = focused ? "#9FC78A" : "#8688BC";
          return (
            <>
              <FriendsIcon focused={focused} />
            </>
          );
        },
      }}
    />
    <Tabs.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused, color }) => {
          color = focused ? "#9FC78A" : "#8688BC";
          return (
            <>
              <UserIcon focused={focused} />
            </>
          );
        },
      }}
    />
  </Tabs.Navigator>
);

export default function App() {
  if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePage"
          component={TabsScreenNav}
          options={{
            animationEnabled: false,
            headerShown: false,
          }}
        />
        {/* <Stack.Screen name="HomePage" component={HomePage} /> */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GoogleSignIn" component={AuthScreen} />
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

    // <Provider>
    //   <userContext.Provider>
    //     <NavigationContainer>
    //       <Stack.Navigator>
    //         <>
    //           <Stack.Screen
    //             name="HomePage"
    //             component={HomePage}
    //             options={{
    //               animationEnabled: false,
    //               headerShown: false,
    //             }}
    //           />
    //           <Stack.Screen
    //             name="Challenge Tracker"
    //             component={ChallengeTrackerScreen}
    //             options={{
    //               title: "",
    //               headerBackAllowFontScaling: true,
    //               headerBackTitleStyle: {
    //                 fontSize: 16,
    //               },
    //               headerTransparent: true,
    //               headerTintColor: "white",
    //             }}
    //           />
    //         </>
    //         <>
    //           <Stack.Screen
    //             name="Login"
    //             component={LoginScreen}
    //             title=""
    //             options={{
    //               animationEnabled: false,
    //               headerShown: false,
    //             }}
    //           />
    //           <Stack.Screen
    //             name="Registration"
    //             title=""
    //             options={{
    //               animationEnabled: false,
    //               headerShown: false,
    //             }}
    //             component={RegistrationScreen}
    //           />
    //         </>
    //       </Stack.Navigator>
    //     </NavigationContainer>
    //     {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
    //   </userContext.Provider>
    // </Provider>
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
