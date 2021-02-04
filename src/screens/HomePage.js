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
        <Text style={styles.headerText}>Home (placeholder)</Text>
      </View>
      <ScrollView>
        <View style={styles.activeChalengesContainer}>
          <Text style={styles.activeChallengesHeader}>Active Challenges</Text>
          <ScrollView horizontal={true}>
            <FlatList
              data={challenges}
              keyExtractor={(challenge) => challenge.id}
              renderItem={({ item }) => (
                <View style={styles.activeChallengeInfo}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Challenge Tracker", item)
                    }
                  >
                    <Text style={styles.challengeText}>{item.title}</Text>
                  </TouchableOpacity>
                  <Text>{item.category}</Text>

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
            <Text>View All Personal Challenges</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkView}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Friend Challenges")}
          >
            <Text>View All Friend Challenges</Text>
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
        <Text style={{ fontSize: 60, paddingBottom: 30 }}>
          {user.totalPoints}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  header: {
    backgroundColor: "green",
    padding: 10,
    width: "100%",
  },
  headerText: {
    fontSize: 40,
  },
  activeChallengesContainer: {
    flexDirection: "column",
    flex: 1,
  },
  activeChallengesHeader: {
    fontSize: 30,
  },
  activeChallengeInfo: {
    flexDirection: "row",
    margin: 5,
    borderWidth: 1,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
  },
  challengeText: {
    fontSize: 20,
  },
  linkView: {
    alignItems: "center",
    padding: 10,
    marginVertical: 20,
    backgroundColor: "lightgreen",
    borderWidth: 1,
  },
  completeButtonView: {
    backgroundColor: "lightgreen",
    borderLeftWidth: 1,
  },
  completedButtonView: {
    backgroundColor: "orange",
    borderLeftWidth: 1,
  },
});
