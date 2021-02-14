import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import * as firebase from "firebase";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";

// import App from "../../App";

// App.initializeApp();
import apiKeys from "../../config/keys";

if (!firebase.apps.length) {
  console.log("Connected with Firebase");
  firebase.initializeApp(apiKeys.firebaseConfig);
}

// create collection in firebase
const db = firebase.firestore();
const friendChallengeInvitesRef = db.collection("friendChallengeInvites");

const FriendList = ({ navigation, route }) => {
  // state with all friends which belong to userId
  const [friends, setFriends] = useState([]);
  let userId = firebase.auth().currentUser.uid;
  const isFocused = useIsFocused();

  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;

  // useEffect to call route and retrive all friends from db
  useEffect(() => {
    async function getFriends() {
      const res = await EXPRESS_ROOT_PATH.get(
        `/users/friends/accepted/${userId}`
      );
      const allFriends = res.data;
      setFriends(allFriends);
    }
    getFriends();
  }, [isFocused]);

  // WRITE FRIEND INVITE IN FIRESTORE FROM HERE
  async function onPressInviteForChallenge(receiverId) {
    console.log("receiverId", receiverId);
    await friendChallengeInvitesRef.add({
      challengeId: route.params.challengeId,
      senderId: userId,
      receiverId,
      status: "pending",
      badge: route.params.badge,
      // save time in miliseconds
      createdAt: new Date().getTime(),
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Choose Friend</Text>
      </View>
      <ScrollView>
        <FlatList
          data={friends}
          keyExtractor={(friend, index) => index}
          renderItem={({ item }) => (
            <View style={styles.friendBox}>
              <View>
                <Image
                  source={require("../../assets/profilePic.png")}
                  style={{ transform: [{ scale: 0.4 }] }}
                />
              </View>
              <View style={[styles.friendName, { left: WIDTH / 5 }]}>
                <TouchableOpacity
                  onPress={(event) => {
                    onPressInviteForChallenge(item.uid);
                    navigation.navigate("Home", {
                      challengeId: route.params.challengeId,
                    });
                  }}
                >
                  <Text style={styles.friendText}>
                    Challenge
                    {" " + item.firstName + " " + item.lastName}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7f3",
  },
  containerForList: {
    paddingTop: 30,
    backgroundColor: "gray",
  },
  list: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    backgroundColor: "#f9f1f1",
    justifyContent: "space-between",
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 60,
  },
  header: {
    backgroundColor: "#689451",
    paddingTop: 35,
    padding: 5,
    width: "100%",
    textAlign: "center",
    height: 100,
  },
  headerText: {
    fontSize: 30,
    color: "white",
    marginTop: 5,
    fontFamily: "Avenir-Book",
    textTransform: "capitalize",
    textAlign: "center",
  },
  friendBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 100,
  },
  friendText: {
    fontSize: 20,
    fontStyle: "italic",
  },
  friendName: {
    borderWidth: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 35,
    borderRadius: 4,
    zIndex: -1,
    backgroundColor: "#689451",
  },
});

export default FriendList;
