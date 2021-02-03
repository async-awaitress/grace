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
} from "react-native";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";

export default function HomePage({ navigation }) {
  // const challenges = [
  //   {
  //     id: 1,
  //     title: "Water Warrior",
  //     category: "water",
  //     duration: 7,
  //     pointsPerDay: 2,
  //     description: "Take shower for less than 5 minutes",
  //   },
  //   {
  //     id: 2,
  //     title: "Waste Warrior",
  //     category: "waste",
  //     duration: 5,
  //     pointsPerDay: 1,
  //     description:
  //       "Don't use disposable or single use containers, bottles, utensils",
  //   },
  //   {
  //     id: 3,
  //     title: "Transit Warrior",
  //     category: "transportation",
  //     duration: 14,
  //     pointsPerDay: 2,
  //     description:
  //       "Instead of taking a car - walk, bike or take public transportation",
  //   },
  // ];

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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home (placeholder)</Text>
      </View>
      <ScrollView>
        <View style={styles.activeChalengesContainer}>
          <Text style={styles.activeChallengesHeader}>Active Challenges</Text>
          <ScrollView horizontal={true}>
            {/* Three FlatLists are used here to achieve a mockup Effect of horizontal scroll witrh limited data.  It will be replaced by a map that makes a new FlatList for every 3-5 active challenges */}
            <FlatList
              data={challenges}
              keyExtractor={(challenge) => challenge.challengeId}
              renderItem={({ item }) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>{item.title}</Text>
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
