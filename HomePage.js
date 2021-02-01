import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ScrollView,
} from "react-native";

export default function HomePage() {
  const activeChallengesData = [
    {
      id: 1,
      challengeName: "Take Public Transit To Work",
      challengeType: "Personal",
    },
    {
      id: 2,
      challengeName: "Refill Your Reusable Water Bottle",
      challengeType: "Personal",
    },
    {
      id: 3,
      challengeName: "Turn Off The Light Switch",
      challengeType: "Friend",
    },
    { id: 4, challengeName: "Cook A Meal At Home", challengeType: "Friend" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home (placeholder)</Text>
      </View>
      <ScrollView>
        <View style={styles.activeChalengesContainer}>
          <Text style={styles.activeChallengesHeader}>Active Challenges</Text>
          <FlatList
            data={activeChallengesData}
            renderItem={(challengeData) => (
              <View style={styles.activeChallengeInfo}>
                <Text style={styles.challengeItem}>
                  {challengeData.item.challengeName}
                </Text>
                {/* <Text>{challengeData.item.challengeType}</Text> */}
                <Button title="Complete" />
              </View>
            )}
          />
        </View>
        <View>
          <Text style={styles.activeChallengesHeader}>Personal Challenges</Text>
          <FlatList
            data={activeChallengesData}
            renderItem={(challengeData) => (
              <View style={styles.activeChallengeInfo}>
                <Text>{challengeData.item.challengeName}</Text>
                {/* <Text>{challengeData.item.challengeType}</Text> */}
              </View>
            )}
          />
        </View>
        <View>
          <Text style={styles.activeChallengesHeader}>Friend Challenges</Text>
          <FlatList
            data={activeChallengesData}
            renderItem={(challengeData) => (
              <View style={styles.activeChallengeInfo}>
                <Text>{challengeData.item.challengeName}</Text>
                {/* <Text>{challengeData.item.challengeType}</Text> */}
              </View>
            )}
          />
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
    flex: 1
  },
  activeChallengesHeader: {
    fontSize: 20,
  },
  activeChallengeInfo: {
    flexDirection: "row",
    borderWidth: 1,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
  },
  challengeItem: {},
});
