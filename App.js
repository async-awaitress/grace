import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as firebase from "firebase";
import apiKeys from "./config/keys";
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import {
  FriendsIcon,
  HomeIcon,
  UserIcon,
  AuthScreen,
  ChallengeDetailsScreen,
  ChallengeTrackerScreen,
  FriendChallengesScreen,
  Friends,
  HomePage,
  LoginScreen,
  PersonalChallengesScreen,
  ProfileScreen,
  RegistrationScreen,
} from "./src/screens";

const Stack = createStackNavigator();
const ChallengeStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

//nav between home, challenge list, and challenge details
const ChallengeScreenNav = () => (
  <ChallengeStack.Navigator
    initialRouteName="Home"
    screenOptions={{
      title: "",
      headerBackAllowFontScaling: true,
      headerBackTitleStyle: {
        fontSize: 16,
      },
      headerTransparent: true,
      headerTintColor: "white",
    }}
  >
    <ChallengeStack.Screen
      name="Home"
      component={HomePage}
      options={{
        title: "",
      }}
    />
    <ChallengeStack.Screen
      name="Personal Challenges"
      component={PersonalChallengesScreen}
      options={{ title: "" }}
      backBehavior="order"
    />
    <ChallengeStack.Screen
      name="Friend Challenges"
      component={FriendChallengesScreen}
      options={{ title: "" }}
      backBehavior="order"
    />
    <ChallengeStack.Screen
      name="Challenge Details"
      component={ChallengeDetailsScreen}
      options={{ title: "" }}
      backBehavior="order"
    />
  </ChallengeStack.Navigator>
);

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
        color = focused ? "#689451" : "#383db8";
        return <Feather name={iconName} size={20} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: "#689451",
      inactiveTintColor: "#383db8",
    }}
  >
    <Tabs.Screen
      name="Home"
      component={ChallengeScreenNav}
      options={{
        tabBarIcon: ({ focused, color }) => {
          color = focused ? "#689451" : "#383db8";
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
          color = focused ? "#689451" : "#383db8";
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
          color = focused ? "#689451" : "#383db8";
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
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
          }}
        />
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
        <Stack.Screen
          name="Challenge Tracker"
          component={ChallengeTrackerScreen}
          options={{headerShown: false }}
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
