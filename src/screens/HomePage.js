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

export default function HomePage({ navigation }) {
  const [firstName, setFirstName] = useState("");
  let currentUserUID = firebase.auth().currentUser.uid;

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

  const handlePress = () => {
    loggingOut();
    navigation.navigate("Login");
  };

  const isFocused = useIsFocused();
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState({});
  const [dailyCompletion, setDailyCompletion] = useState({});

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await axios.get(
          `${EXPRESS_ROOT_PATH}/api/challenges/${currentUserUID}`
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

  const fetchPoints = async () => {
    try {
      const res = await axios.get(
        `${EXPRESS_ROOT_PATH}/api/users/${currentUserUID}`
      );
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
      const res = await axios.put(
        `${EXPRESS_ROOT_PATH}/api/personalChallenges/updatePersonalChallenge/${challengeId}`,
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {firstName}</Text>
      </View>
      <ScrollView>
        <Text style={styles.activeChallengesHeader}>Active Challenges</Text>
        <View style={styles.challengesContainer}>
          <ScrollView style={styles.activeChallengeContainer} horizontal={true}>
            {/* Three FlatLists are used here to achieve a mockup Effect of horizontal scroll witrh limited data.  It will be replaced by a map that makes a new FlatList for every 3-5 active challenges */}
            <FlatList
              horizontal
              data={challenges}
              keyExtractor={(challenge) => challenge.id}
              renderItem={({ item }) => (
                <View style={styles.activeChallengeInfo}>
                  {/* <Text style={styles.challengeText}>{item.title}</Text>
                  <Text>{item.category}</Text> */}
                  <Image
                    source={icons[item.badge]}
                    style={{ width: 70, height: 70 }}
                  />

                  <TouchableOpacity
                    onPress={() => navigation.navigate("Challenge Tracker", item)}
                  >
                    <Text>Challnge Tracker</Text>
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
        </View>
        <View style={styles.linkView}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Personal Challenges")}
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

        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
      <View>
        <Text
          style={{ fontSize: 28, paddingBottom: 5, fontFamily: "Bradley Hand" }}
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
    padding: 40,
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
    // flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "space-between",
    width: 400,
    height: 190,
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
    fontSize: 40,
    fontFamily: "Bradley Hand",
    margin: 5,
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
    height: 180,
    width: 110,
  },
  linkView: {
    alignItems: "center",
    padding: 10,
    marginVertical: 20,
    marginTop: 50,
    backgroundColor: "#f9f1f1",
    borderWidth: 2,
    borderRadius: 50,
  },
  linkViewText: {
    fontSize: 25,
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
