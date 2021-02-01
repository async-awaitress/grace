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

export default function HomePage({navigation}) {
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
              data={challenges}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.title}
                  </Text>
                  <Button title="Complete" />
                </View>
              )}
            />
            <FlatList
              data={challenges}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.title}
                  </Text>
                  <Button
                    title="Complete"
                    onPress={() => navigation.push("MockChallenges")}
                  />
                </View>
              )}
            />
          </ScrollView>
        </View>
        <View>
          <Button
            title="View Personal Challenges"
            onPress={() => navigation.push("MockChallenges")}
          />
        </View>
        <View>
          <Button
            title="View Friend Challenges"
            onPress={() => navigation.push("MockChallenges")}
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
    flex: 1,
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
    fontSize: 20,
  },
});
