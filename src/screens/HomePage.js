import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as firebase from "firebase";
import { loggingOut } from "../../API/methods";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { icons } from "./Icons/icons";
import apiKeys from "../../config/keys";
import PendingChallengeComponent from "./PendingChallengeComponent";
import ReceiveChallengeComponent from "./ReceiveChallengeComponent";

// create collection in firebase
if (!firebase.apps.length) {
  console.log("Connected with Firebase");
  firebase.initializeApp(apiKeys.firebaseConfig);
}

const db = firebase.firestore();
const friendChallengeInvitesRef = db.collection("friendChallengeInvites");

export default function HomePage({ navigation }) {
  let currentUserUID = firebase.auth().currentUser.uid;

  const isFocused = useIsFocused();
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState({});
  const [firstName, setFirstName] = useState("");
  const [dailyCompletion, setDailyCompletion] = useState({});
  const [friendChallenges, setFriendChallenges] = useState([]);

  useEffect(() => {
    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection("users")
        .doc(currentUserUID)
        .get();

      if (!doc.exists) {
        Alert.alert("No user data found!");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
      }
    }
    getUserInfo();
  });

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await EXPRESS_ROOT_PATH.get(
          `/challenges/${currentUserUID}`
        );
        const challenges = res.data;
        const dailyCompletionObjToSet = {};
        challenges.forEach((challenge) => {
          dailyCompletionObjToSet[challenge.id] =
            challenge.personalChallenge.dailyStatus;
        });
        setDailyCompletion(dailyCompletionObjToSet);
        setChallenges(res.data);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchChallenges();
  }, [isFocused]);

  // listening from firebase req/invites for FriendChallenges
  useEffect(() => {
    const unsubscribe = friendChallengeInvitesRef.onSnapshot(
      (querySnapshot) => {
        const nextFriendChallenges = querySnapshot
          // return array of the docs changes since the last snapshot
          .docChanges()
          // we want to listen messages which are only added
          .filter(({ type }) => type === "added")
          // we listen to all pending friend challenges from the user (sender)
          .filter(({ doc }) => {
            const currentUserUid = firebase.auth().currentUser.uid;
            const friendChanllenge = doc.data();

            return (
              // listening to challenges I send and receive
              (friendChanllenge.senderId === currentUserUid ||
                friendChanllenge.receiverId === currentUserUid) &&
              friendChanllenge.status === "pending"
            );
          })
          .map(({ doc }) => {
            // doc.data is method in doc object (unpack data)
            const friendPendingChallenge = doc.data();
            const docId = doc.id;
            return { ...friendPendingChallenge, ...{ docId } };
          });

        // setFriendChallenges([...friendChallenges, ...nextFriendChallenges]);
        setFriendChallenges(nextFriendChallenges);
      }
    );
    //
    return () => unsubscribe();
  }, []);

  //listening for change in status from pending to accepted or declined
  useEffect(() => {
    const unsubscribe = friendChallengeInvitesRef.onSnapshot(
      (querySnapshot) => {
        const removedFriendChallenges = querySnapshot
          // return array of the docs changes since the last snapshot
          .docChanges()
          // we want to listen messages which are only removed
          .filter(({ type }) => type === "removed");
        // we listen to all pending friend challenges from the user (sender)
        // .filter(({ doc }) => {
        //   const currentUserUid = firebase.auth().currentUser.uid;
        //   const friendChanllenge = doc.data();

        //   return (
        //     // listening to challenges I send and receive
        //     (friendChanllenge.senderId === currentUserUid ||
        //       friendChanllenge.receiverId === currentUserUid) &&
        //     friendChanllenge.status === "pending"
        //   );
        // })
        // .map(({ doc }) => {
        //   // doc.data is method in doc object (unpack data)
        //   const friendPendingChallenge = doc.data();
        //   const docId = doc.id;
        //   return { ...friendPendingChallenge, ...{ docId } };
        // });
        console.log("removed friend challenges", removedFriendChallenges);
        // fetchFriendChallenges(currentUserUID);
        // setFriendChallenges([...friendChallenges, ...nextFriendChallenges]);
        // setFriendChallenges(removedFriendChallenges);
      }
    );
    //
    return () => unsubscribe();
  }, []);

  const fetchPoints = async () => {
    try {
      const res = await EXPRESS_ROOT_PATH.get(`/users/${currentUserUID}`);
      setUser(res.data);
    } catch (error) {
      console.log("get request failed", error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const updateChallenge = async (userId, challengeId) => {
    try {
      const res = await EXPRESS_ROOT_PATH.put(
        `/personalChallenges/updatePersonalChallenge/${challengeId}`,
        { uid: userId }
      );
      // dailyStatus = "true"
      const dailyStatus = res.data.dailyStatus;
      const dailyCompletionObjToSet = { [challengeId]: dailyStatus };

      // spreading previous state and current state
      setDailyCompletion({ ...dailyCompletion, ...dailyCompletionObjToSet });
      fetchPoints();
    } catch (error) {
      console.log("update request failed", error);
    }
  };

  // get all friend challenges of the user
  const fetchFriendChallenges = async (currentUserUID) => {
    try {
      const allFriendChallenges = await EXPRESS_ROOT_PATH.get(
        `/friendChallenges/${currentUserUID}`
      );
      setFriendChallenges(allFriendChallenges);
    } catch (error) {
      console.log("there was an error fetching the challenges", error);
    }
  };

  // create collection in firebase
  const db = firebase.firestore();
  const friendChallengeInvitesRef = db.collection("friendChallengeInvites");

  ///// SEND REQUEST TO EXPRESS ROUTE TO POST FRIEND CHALLENGE IN DB
  const onAccept = async (receiverId, senderId, challengeId) => {
    try {
      // add challenge to db
      await EXPRESS_ROOT_PATH.post("/friendChallenges/add", {
        receiverId: receiverId,
        senderId: senderId,
        challengeId: challengeId,
      });

      // get all friend challenges of the user
      await fetchFriendChallenges(currentUserUID);

      //add challenge to db after acceptance
      setFriendChallenges(friendChallenges.data);

      // render the non faded challenge with complete button (like personal)
      // maybe we need to make a pending section AND friend challenge section
    } catch (error) {
      console.log("friend challenge not added to db", error);
    }
  };

  const removeFromFirebase = async (docId) => {
    try {
      await friendChallengeInvitesRef.doc(docId).delete();
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome,</Text>
        <Text style={styles.headerText}>{firstName}!</Text>
      </View>
      <ScrollView>
        {challenges.length === 0 ? (
          <Text style={styles.activeChallengesHeader}>
            You have no active challenges
          </Text>
        ) : (
          <Text style={styles.activeChallengesHeader}>
            Your Active Challenges
          </Text>
        )}
        <View style={styles.challengesContainer}>
          {challenges.length === 0 ? (
            <Image
              style={{ height: 80, width: 400 }}
              source={{
                uri:
                  "https://botanicalpaperworks.com/wp-content/uploads/2020/07/BotanicalPaperWorks_header_placeholder.jpg",
              }}
            />
          ) : (
            <ScrollView
              style={styles.activeChallengeContainer}
              // horizontal={true}
            >
              <FlatList
                horizontal
                data={challenges}
                keyExtractor={(challenge) => challenge.id}
                renderItem={({ item }) => (
                  <View style={styles.activeChallengeInfo}>
                    {/* <Text style={styles.challengeText}>{item.title}</Text>
                  <Text>{item.category}</Text> */}

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Challenge Tracker", item)
                      }
                    >
                      <Image
                        source={icons[item.badge]}
                        style={{ width: 70, height: 70 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={dailyCompletion[item.id]}
                      style={
                        dailyCompletion[item.id]
                          ? styles.completedButtonView
                          : styles.completeButtonView
                      }
                      onPress={() => updateChallenge(currentUserUID, item.id)}
                    >
                      {dailyCompletion[item.id] ? (
                        <Text>Done!</Text>
                      ) : (
                        <Text>Complete</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </ScrollView>
          )}

          {/* ////// FRIEND CHALLENGES CONTAINER ///// */}
          <ScrollView style={styles.activeChallengeContainer} horizontal={true}>
            <FlatList
              horizontal
              data={friendChallenges}
              keyExtractor={(friendChallenge) => friendChallenge.id}
              renderItem={({ item }) => {
                if (item.senderId === currentUserUID) {
                  return <PendingChallengeComponent badge={item.badge} />;
                } else {
                  return (
                    <ReceiveChallengeComponent
                      badge={item.badge}
                      onDecline={() => console.log("remove")}
                      onAccept={() => {
                        onAccept(
                          item.receiverId,
                          item.senderId,
                          item.challengeId
                        );
                        removeFromFirebase(item.docId);
                      }}
                    />
                  );
                }
              }}
            />
          </ScrollView>
        </View>
        {/* ///////////////// */}

        <Text style={styles.activeChallengesHeader}>Browse Challenges</Text>
        <View style={styles.linkView}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Personal Challenges", { challenges })
            }
          >
            <Text style={styles.linkViewText}>
              View All Personal Challenges
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkView}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Friend Challenges")}
          >
            <Text style={styles.linkViewText}>View All Friend Challenges</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
        <View>
          <Text
            style={{
              fontSize: 28,
              paddingBottom: 5,
              fontFamily: "Bradley Hand",
              textAlign: "center",
            }}
          >
            Your Total Points
          </Text>
          <Text
            style={{
              fontSize: 70,
              paddingBottom: 30,
              textAlign: "center",
              fontFamily: "Bradley Hand",
            }}
          >
            {user.totalPoints}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ffedd6",
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "space-around",
  },
  header: {
    backgroundColor: "#ff924c",
    paddingTop: 40,
    padding: 15,
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
  activeChallengeContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    width: 400,
    height: 175,
  },

  challengesContainer: {
    backgroundColor: "#f9f1f1",
    flexDirection: "column",
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
  },
  activeChallengesHeader: {
    fontSize: 35,
    fontFamily: "Bradley Hand",
    marginVertical: 20,
    textAlign: "center",
  },
  activeChallengeInfo: {
    flexDirection: "column",
    margin: 5,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#ffedd6",
    backgroundColor: "white",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    height: 170,
    width: 110,
  },
  linkView: {
    alignItems: "center",
    paddingVertical: 10,
    margin: 20,
    backgroundColor: "#f9f1f1",
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "green",
    width: 350,
  },
  linkViewText: {
    fontSize: 20,
    fontFamily: "Bradley Hand",
  },
  completeButtonView: {
    backgroundColor: "lightgreen",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
  completedButtonView: {
    backgroundColor: "orange",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
});
