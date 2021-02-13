import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import * as firebase from "firebase";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { loggingOut } from "../../API/methods";
import { icons } from "./Icons/icons";

const ProfileScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [user, setUser] = useState({});
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [completedFriendChallenges, setCompletedFriendChallenges] = useState(
    []
  );

  const handlePress = async () => {
    await loggingOut();
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        navigation.replace("Login");
      }
    });
  };

  // let currentUserUID = firebase.auth().currentUser.uid;
  // console.log("UID", currentUserUID)
  let currentUserUID = firebase.auth().currentUser.uid;
  useEffect(() => {
    async function getCompletedChallenges() {
      try {
        const res = await EXPRESS_ROOT_PATH.get(
          `/challenges/completedChallenges/${currentUserUID}`
        );
        setCompletedChallenges(res.data);
      } catch (error) {
        next(error);
      }
    }
    getCompletedChallenges();
  }, [isFocused]);

  // get all active friend challenges of the user
  const fetchFriendChallenges = async (currentUserUID) => {
    try {
      const allFriendChallenges = await EXPRESS_ROOT_PATH.get(
        `/friendChallenges/${currentUserUID}`
      );
      const completedFriendChallenges = allFriendChallenges.data.filter(
        (challenge) => challenge.completionStatus === "completed"
      );
      setCompletedFriendChallenges(completedFriendChallenges);
    } catch (error) {
      console.log("there was an error fetching the challenges", error);
    }
  };

  useEffect(() => {
    fetchFriendChallenges(currentUserUID);
  }, [isFocused]);

  useEffect(() => {
    async function fetchUser() {
      let currentUserUID = firebase.auth().currentUser.uid;
      try {
        const res = await EXPRESS_ROOT_PATH.get(`/users/${currentUserUID}`);
        setUser(res.data);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchUser();
  }, [isFocused]);

  const options = { year: "numeric", month: "long", day: "numeric" };
  let date = new Date(user.createdAt);
  let joinedDate = date.toLocaleDateString(undefined, options);

  let status;
  if (user.totalPoints < 100) {
    status = "Master Racer";
  } else if (user.totalPoints < 200) {
    status = "Grand Master Racer";
  } else if (user.totalPoints < 200) {
    status = "Arch Master Racer";
  } else if (user.totalPoints < 200) {
    status = "Supreme Master Racer";
  } else {
    status = "Ultimate Master Racer";
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 370,
          height: 230,
          backgroundColor: "#a7f9ef",
          borderRadius: 20,
          borderWidth: 6,
          borderColor: "#9deaff",
          shadowOffset: { width: 10, height: 10 },
          shadowColor: "#9deaff",
          shadowOpacity: 0.5,
        }}
      >
        <View
          style={{
            width: 40,
            height: 20,
            backgroundColor: "white",
            borderRadius: 10,
            margin: 10,
            alignSelf: "flex-end",
          }}
        />
        <View>
          <Text>{status}</Text>
          <Text
            style={styles.totalPoints}
          >{`Total Points\n${user.totalPoints}`}</Text>
        </View>
        <View>
          <Text style={styles.createdAt}>{`Joined Date\n${joinedDate}`}</Text>
        </View>
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
      </View>

      <View
        style={{
          width: 370,
          height: 230,
          backgroundColor: "#fdffb6",
          margin: 7,
          borderRadius: 20,
          borderWidth: 6,
          borderColor: "#e4ffbb",
          shadowOffset: { width: 10, height: 10 },
          shadowColor: "#e4ffbb",
          shadowOpacity: 1.0,
        }}
      >
        <View
          style={{
            width: 40,
            height: 20,
            backgroundColor: "white",
            borderRadius: 10,
            margin: 10,
            alignSelf: "flex-end",
          }}
        />
      </View>

      <View style={styles.ImageContainer}>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/profilePic.png")}
        />
      </View>

      <View
        style={{
          width: 370,
          height: 210,
          backgroundColor: "#ff87ab",
          margin: 7,
          borderRadius: 20,
          borderWidth: 6,
          borderColor: "#ff5d8f",
          shadowOffset: { width: 10, height: 10 },
          shadowColor: "#ff5d8f",
          shadowOpacity: 0.5,
        }}
      >
        <View
          style={{
            width: 40,
            height: 20,
            backgroundColor: "white",
            borderRadius: 10,
            margin: 10,
            alignSelf: "flex-end",
          }}
        />
        <View>
          <Text style={{ padding: 6 }}>Badges Earned</Text>
        </View>

        <ScrollView style={styles.badgesEarned} horizontal={true}>
          <FlatList
            horizontal
            data={completedChallenges}
            renderItem={({ item }) => (
              <View style={styles.completedChallenges}>
                <TouchableOpacity>
                  <Image
                    source={icons[item.badge]}
                    style={{ width: 50, height: 50 }}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
          <FlatList
            horizontal
            data={completedFriendChallenges}
            renderItem={({ item }) => (
              <View style={styles.completedChallenges}>
                <TouchableOpacity>
                  <Image
                    source={icons[item.badge]}
                    style={{ width: 50, height: 50 }}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        </ScrollView>
      </View>

      <View
        style={{
          width: 70,
          height: 30,
          backgroundColor: "black",
          margin: 2,
          borderRadius: 20,
          borderWidth: 6,
          borderColor: "#ff5d8f",
          shadowOffset: { width: 10, height: 10 },
          shadowColor: "#ff5d8f",
          shadowOpacity: 0.5,
        }}
      >
        <TouchableOpacity onPress={handlePress}>
          <Text style={{ color: "white" }}> Log out</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },
  container: {
    top: 40,
    paddingTop: 40,
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },

  button: {
    marginHorizontal: 50,
    backgroundColor: "#bdb2ff",
    borderRadius: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  createdAt: {
    textAlign: "right",
    paddingTop: 10,
    paddingRight: 6,
    fontWeight: "bold",
  },
  totalPoints: {
    textAlign: "right",
    paddingTop: 10,
    paddingRight: 6,
    fontWeight: "bold",
  },
  name: {
    color: "black",
    position: "absolute",
    padding: 2,
    fontSize: 16,
    fontWeight: "bold",
    left: 10,
    bottom: -70,
    height: "50%",
  },
  ImageContainer: {
    borderRadius: 150 / 2,
    top: 170,
    position: "absolute",
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    alignSelf: "center",
  },
  badgesEarned: {
    display: "flex",
    left: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignContent: "space-between",
    width: 350,
    height: 200,
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 7,
    backgroundColor: "#ff87ab",
  },
  activeChallengeContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    width: 400,
    height: 140,
    color: "white",
  },
});

export default ProfileScreen;
