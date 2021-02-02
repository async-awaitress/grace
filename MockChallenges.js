import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";

export default function MockChallenges() {
  const challenges = [
    {
      id: 1,
      title: "Water Warrior",
      category: "water",
      duration: 7,
      pointsPerDay: 2,
      type: "personal",
      badge: "./assets/water",
      description: "Take shower for less than 5 minutes",
    },
  ];

  const personalChallenges = challenges.filter(
    (challenge) => challenge.type === "personal"
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Personal Challenges</Text>
      </View>
      <Text style={styles.personalChallengesHeader}>
        Start a Personal Challenge!
      </Text>
      <FlatList
        data={personalChallenges}
        renderItem={(challengeData) => (
          <View style={styles.activeChallengeInfo}>
            <View style={styles.titleSection}>
              <Text style={styles.challengeText}>
                {challengeData.item.title}
              </Text>
              <Text>
                {challengeData.item.pointsPerDay * challengeData.item.duration}{" "}
                Points
              </Text>
            </View>

            <View>
              <Text>{challengeData.item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  personalChallengesHeader: {
    fontSize: 30,
  },
  activeChallengeInfo: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
    alignItems: "center",
    width: 350,
  },
  challengeText: {
    fontSize: 20,
  },
  titleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1
  }
});
