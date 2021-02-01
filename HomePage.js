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
      title: "Take Public Transit To Work",
      challengeType: "Personal",
    },
    {
      id: 2,
      title: "Refill Your Reusable Water Bottle",
      challengeType: "Personal",
    },
    {
      id: 3,
      title: "Turn Off The Light Switch",
      challengeType: "Friend",
    },
    { id: 4, title: "Cook A Meal At Home", challengeType: "Friend" },
  ];

    const personalChallengesData = [
      {
        id: 1,
        challengeName: "Shower less than 5 min",
        challengeType: "Personal",
      },
      {
        id: 2,
        challengeName: "Recycle",
        challengeType: "Personal",
      },
      {
        id: 3,
        challengeName: "Unplug Unused Devices",
        challengeType: "Personal",
      },
      { id: 4, challengeName: "Compost", challengeType: "Personal" },
    ];

      const friendChallengesData = [
        {
          id: 1,
          challengeName: "Close Your Windows",
          challengeType: "Friend",
        },
        {
          id: 2,
          challengeName: "Sustainably Packaged Products",
          challengeType: "Friend",
        },
        {
          id: 3,
          challengeName: "Turn Off Faucet While Brushing Teeth",
          challengeType: "Friend",
        },
        {
          id: 4,
          challengeName: "Switch To LED",
          challengeType: "Friend",
        },
      ];

      const challenges = [
        {
          id: 1,
          title: "Water Warrior",
          category: "water",
          duration: 7,
          pointsPerDay: 2,
          description: "Take shower for less than 5 minutes",
        },
        {
          id: 2,
          title: "Waste Warrior",
          category: "waste",
          duration: 5,
          pointsPerDay: 1,
          description:
            "Don't use disposable or single use containers, bottles, utensils",
        },
        {
          id: 3,
          title: "Transit Warrior",
          category: "transportation",
          duration: 14,
          pointsPerDay: 2,
          description:
            "Instead of taking a car - walk, bike or take public transportation",
        },
      ];

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
              data={activeChallengesData}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.title}
                  </Text>
                  {/* <Text>{challengeData.item.challengeType}</Text> */}
                  <Button title="Complete" />
                </View>
              )}
            />
            <FlatList
              data={activeChallengesData}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.title}
                  </Text>
                  {/* <Text>{challengeData.item.challengeType}</Text> */}
                  <Button title="Complete" />
                </View>
              )}
            />
          </ScrollView>
        </View>
        <View>
          <Text style={styles.activeChallengesHeader}>Personal Challenges</Text>
          <ScrollView horizontal={true}>
            <FlatList
              data={personalChallengesData}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.challengeName}
                  </Text>
                </View>
              )}
            />
          </ScrollView>
        </View>
        <View>
          <Text style={styles.activeChallengesHeader}>Friend Challenges</Text>
          <ScrollView horizontal={true}>
            <FlatList
              data={friendChallengesData}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.challengeName}
                  </Text>
                </View>
              )}
            />
          </ScrollView>
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
    fontSize: 30,
  },
  activeChallengeInfo: {
    flexDirection: "row",
    borderWidth: 1,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
  },
  challengeText: {
    fontSize: 20
  }
});
