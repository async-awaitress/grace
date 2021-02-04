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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${EXPRESS_ROOT_PATH}/api/challenges/aaa`);
        setChallenges(res.data);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchData();
    // isFocused call useEffect whenever we view this component
  }, [isFocused]);

  if(challenges.length > 0) {
    console.log(challenges[0].personalChallenge.dailyStatus)
  }


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
              keyExtractor={(challenge) => challenge.challengeId}
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
                  <TouchableOpacity style={styles.completeButtonView}>
                    <Text>Complete</Text>
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
            <Text>View Personal Challenges</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkView}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Friend Challenges")}
          >
            <Text>View Friend Challenges</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
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
});
