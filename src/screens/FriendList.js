import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as firebase from "firebase";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import "firebase/firestore";
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
  console.log("friends", friends);

  // useEffect to call route and retrive all friends from db
  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await EXPRESS_ROOT_PATH.get(`/users/friends/${userId}`);
        const friends = res.data;
        setFriends(friends);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchFriends();
  }, []);

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
    console.log("invite sent");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Choose</Text>
        <Text style={styles.headerText}>Friend</Text>
      </View>
      <ScrollView>
        <View style={styles.list}>
          <FlatList
            keyExtractor={(item) => {
              return item.id;
            }}
            data={friends}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={(event) => {
                    console.log("heree", item.uid);
                    onPressInviteForChallenge(item.uid);
                    navigation.navigate("Home", {
                      challengeId: route.params.challengeId,
                    });
                  }}
                >
                  <Text>Invite {item.firstName} for challenge</Text>
                </TouchableOpacity>
              );
            }}
          ></FlatList>
          {/* <Text style={styles.list}>Name</Text> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffedd6",
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
    backgroundColor: "#ff924c",
    paddingTop: 35,
    padding: 5,
    width: "100%",
    textAlign: "center",
  },
  headerText: {
    fontSize: 30,
    color: "white",
    marginTop: 5,
    fontFamily: "Bradley Hand",
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default FriendList;
