import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  LogBox,
} from "react-native";
import * as firebase from "firebase";
import { useIsFocused } from "@react-navigation/native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { icons } from "./Icons/icons";
import apiKeys from "../../config/keys";
import PendingChallengeComponent from "./PendingChallengeComponent";
import ReceiveChallengeComponent from "./ReceiveChallengeComponent";
import ActiveChallengeComponent from "./ActiveChallengeComponent";

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
  const [dailyCompletionFriends, setDailyCompletionFriends] = useState({});
  const [pendingFriendChallenges, setPendingFriendChallenges] = useState([]);
  const [activeFriendChallenges, setActiveFriendChallenges] = useState([]);

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

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
  }, []);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await EXPRESS_ROOT_PATH.get(
          `/challenges/${currentUserUID}`
        );
        const challenges = res.data;
        const activeChallenges = challenges.filter(
          (challenge) => challenge.personalChallenge.completionStatus === "open"
        );
        const dailyCompletionObjToSet = {};
        activeChallenges.forEach((challenge) => {
          dailyCompletionObjToSet[challenge.id] =
            challenge.personalChallenge.dailyStatus;
        });
        setDailyCompletion(dailyCompletionObjToSet);
        setChallenges(activeChallenges);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchChallenges();
  }, [isFocused]);

  // get all active friend challenges of the user
  const fetchFriendChallenges = async (currentUserUID) => {
    try {
      const allFriendChallenges = await EXPRESS_ROOT_PATH.get(
        `/friendChallenges/${currentUserUID}`
      );
      const activeFriendChallenges = allFriendChallenges.data.filter(
        (challenge) => challenge.completionStatus === "open"
      );
      setActiveFriendChallenges(activeFriendChallenges);
    } catch (error) {
      console.log("there was an error fetching the challenges", error);
    }
  };

  useEffect(() => {
    fetchFriendChallenges(currentUserUID);
  }, [isFocused]);

  // listening for invites/pending challenges from firebase
  useEffect(() => {
    const unsubscribe = friendChallengeInvitesRef.onSnapshot(
      (querySnapshot) => {
        const nextFriendChallenges = querySnapshot
          // return array of the docs changes since the last snapshot
          .docChanges()
          // we want to listen challenges which are only added
          .filter(({ type }) => type === "added")
          // we listen to all pending friend challenges from the user (sender)
          .filter(({ doc }) => {
            const currentUserUid = firebase.auth().currentUser.uid;
            const friendChallenge = doc.data();

            return (
              // listening to challenges I send and receive
              (friendChallenge.senderId === currentUserUid ||
                friendChallenge.receiverId === currentUserUid) &&
              friendChallenge.status === "pending"
            );
          })
          .map(({ doc }) => {
            // doc.data is method in doc object (unpack data)
            const friendPendingChallenge = doc.data();
            const docId = doc.id;
            return { ...friendPendingChallenge, ...{ docId } };
          });
        appendFriendChallenges(nextFriendChallenges);
      }
    );

    return () => unsubscribe();
  }, []);

  // listening for accepted (modified) challenges from firebase
  useEffect(() => {
    const unsubscribe = friendChallengeInvitesRef.onSnapshot(
      async (querySnapshot) => {
        const docIds = querySnapshot
          // return array of the docs changes since the last snapshot
          .docChanges()
          // we want to listen messages which are only added
          .filter(({ type }) => type === "modified")
          // we listen to all pending friend challenges from the user (sender)
          .filter(({ doc }) => {
            const currentUserUid = firebase.auth().currentUser.uid;
            const friendChallenge = doc.data();
            return (
              // listening to challenges I send and receive
              (friendChallenge.senderId === currentUserUid ||
                friendChallenge.receiverId === currentUserUid) &&
              (friendChallenge.status === "active" ||
                friendChallenge.status === "declined")
            );
          })
          .map(({ doc }) => {
            const docId = doc.id;
            return docId;
          });
        // removing pending challenge (which was accepted) from the state
        if (docIds.length !== 0) {
          removeAcceptedFriendChallengesFromState(docIds[0]);

          // after every change from firebase trigger fetching friend challenges from postgres
          const currentUserUid = firebase.auth().currentUser.uid;
          await fetchFriendChallenges(currentUserUid);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const appendFriendChallenges = useCallback((newChallenge) => {
    // receive the previous challenge and the current one
    // setter from hook receive callback function
    setPendingFriendChallenges((currentState) => [
      ...currentState,
      ...newChallenge,
    ]);
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

  /////// PLACEHOLDER FOR CALLING EXPRESS ROUTES TO UPDATE DAILY FRIEND CHALLENGES
  const updateFriendChallenge = async (
    currentUserUID,
    friendChallengeId,
    senderId,
    receiverId
  ) => {
    try {
      const res = await EXPRESS_ROOT_PATH.put(
        `/friendChallenges/update/${friendChallengeId}/${currentUserUID}`
      );
      if (currentUserUID === senderId) {
        const dailyStatusForSender = res.data.dailyStatusForSender;
        const dailyCompletionObjToSet = {
          [friendChallengeId]: { [senderId]: dailyStatusForSender },
        };
        // spreading previous state and current state
        setDailyCompletionFriends({
          ...dailyCompletionFriends,
          ...dailyCompletionObjToSet,
        });
      } else {
        const dailyStatusForReceiver = res.data.dailyStatusForReceiver;
        const dailyCompletionObjToSet = {
          [friendChallengeId]: { [receiverId]: dailyStatusForReceiver },
        };
        // spreading previous state and current state
        setDailyCompletionFriends({
          ...dailyCompletionFriends,
          ...dailyCompletionObjToSet,
        });
      }
      fetchPoints();
    } catch (error) {
      console.log("update request failed", error);
    }
  };

  const removeAcceptedFriendChallengesFromState = (docIdToRemove) => {
    setPendingFriendChallenges((challenges) =>
      challenges.filter((challenge) => challenge.docId !== docIdToRemove)
    );
  };

  const updateChallengeInFirebase = async (docId, status) => {
    await friendChallengeInvitesRef.doc(docId).update({ status: status });
    console.log("firebase updated");
  };

  ///// SEND REQUEST TO EXPRESS ROUTE TO POST FRIEND CHALLENGE IN DB
  const onAccept = async (challenge) => {
    const { receiverId, senderId, challengeId, docId } = challenge;
    try {
      // add challenge to postgress
      await EXPRESS_ROOT_PATH.post("/friendChallenges/add", {
        receiverId,
        senderId,
        challengeId,
      });

      // update object in firebase from status "pending" to "active"
      await updateChallengeInFirebase(docId, "active");
    } catch (error) {
      console.log("friend challenge not added to db", error);
    }
  };

  const onDecline = async (challenge) => {
    const { docId } = challenge;
    await updateChallengeInFirebase(docId, "declined");
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
            ///////////// PERSONAL ACTIVE CHALLENGES CONTAINER //////////
            <ScrollView
              style={styles.activeChallengeContainer}
              horizontal={true}
            >
              <FlatList
                horizontal
                data={challenges}
                keyExtractor={(challenge) => challenge.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.activeChallengeInfo}>
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

          {/* ////// FRIEND ACTIVE CHALLENGES CONTAINER ///// */}
          {/* <View style={styles.containerForFriendChallenges}></View> */}
          <View style={{ marginTop: 20 }}>
            <Text>Your Active Friend Challenges</Text>
          </View>

          <ScrollView style={styles.activeChallengeContainer} horizontal={true}>
            <FlatList
              horizontal
              data={activeFriendChallenges}
              keyExtractor={(friendChallenge) => friendChallenge.id.toString()}
              renderItem={({ item }) => (
                <ActiveChallengeComponent
                  badge={item.badge}
                  isCompleted={dailyCompletionFriends[item.id]}
                  onComplete={() =>
                    updateFriendChallenge(
                      currentUserUID,
                      item.id,
                      item.senderId,
                      item.receiverId
                    )
                  }
                  challenge={item}
                  navigation={navigation}
                />
              )}
            />
            <FlatList
              horizontal
              data={pendingFriendChallenges}
              keyExtractor={(friendChallenge) => friendChallenge.docId}
              renderItem={({ item }) => {
                if (item.senderId === currentUserUID) {
                  return <PendingChallengeComponent badge={item.badge} />;
                } else {
                  return (
                    <ReceiveChallengeComponent
                      badge={item.badge}
                      onDecline={() => onDecline(item)}
                      onAccept={() => {
                        onAccept(item);
                      }}
                    />
                  );
                }
              }}
            />
          </ScrollView>

          {/* ////// FRIEND PENDING CHALLENGES CONTAINER ///// */}
          {/* <ScrollView style={styles.activeChallengeContainer} horizontal={true}>
            <FlatList
              horizontal
              data={pendingFriendChallenges}
              keyExtractor={(friendChallenge) => friendChallenge.docId}
              renderItem={({ item }) => {
                if (item.senderId === currentUserUID) {
                  return <PendingChallengeComponent badge={item.badge} />;
                } else {
                  return (
                    <ReceiveChallengeComponent
                      badge={item.badge}
                      onDecline={() => console.log("remove")}
                      onAccept={async () => {
                        await onAccept(item);
                      }}
                    />
                  );
                }
              }}
            />
          </ScrollView> */}
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
          <Text style={styles.totalPointsText}>Your Total Points</Text>
          <Text style={styles.totalPointsNum}>{user.totalPoints}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#f2f7f3",
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "space-around",
  },
  header: {
    backgroundColor: "#689451",
    paddingTop: 35,
    padding: 10,
    width: "100%",
    textAlign: "center",
    height: 140,
    // fontFamily: "Bodoni 72",
    // fontFamily: "Georgia",
  },
  headerText: {
    fontSize: 30,
    color: "white",
    marginTop: 5,
    // fontFamily: "Georgia",
    // fontFamily: "Thonburi",

    // fontFamily: "Hiragino Sans",
    // fontFamily: "American Typewriter",
    fontFamily: "Avenir-Book",
    // fontFamily: "Bodoni 72",
    textAlign: "center",
    textTransform: "capitalize"
  },

  nameText: {
    textTransform: "capitalize",
    fontSize: 30,
    color: "white",
    marginTop: 5,
    // fontFamily: "Avenir-Book",
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
    backgroundColor: "#e1f2e5",
    flexDirection: "column",
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
  },
  activeChallengesHeader: {
    fontSize: 25,
    fontFamily: "Avenir-Book",
    marginVertical: 10,
    textAlign: "center",
  },
  activeChallengesHeaderLine2: {
    fontSize: 25,
    fontFamily: "Avenir-Book",
    textAlign: "center",
    marginBottom: 5,
  },
  activeChallengeInfo: {
    flexDirection: "column",
    margin: 5,
    // borderWidth: 2,
    borderRadius: 20,
    // borderColor: "#f2f7f3",
    backgroundColor: "white",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    height: 170,
    width: 110,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.0,
    elevation: 2,
  },
  linkView: {
    alignItems: "center",
    alignContent: "center",
    paddingVertical: 8,
    margin: 20,
    backgroundColor: "#f4f7f2",
    borderWidth: 2,
    borderRadius: 40,
    borderColor: "#689451",
    width: 380,
  },
  linkViewText: {
    fontSize: 20,
    fontFamily: "Avenir-Book",
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
    backgroundColor: "#689451",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
  totalPointsText: {
    fontSize: 28,
    paddingBottom: 5,
    fontFamily: "Avenir-Book",
    textAlign: "center",
  },
  totalPointsNum: {
    fontSize: 70,
    paddingBottom: 30,
    textAlign: "center",
    fontFamily: "Avenir-Book",
  },
});
