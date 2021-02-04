import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { VictoryPie } from "victory-native";

const ChallengeTrackerScreen = ({ route, navigation }) => {
  console.log(route.params)

    const {
      id,
      category,
      description,
      pointsPerDay,
      title,
      type,
      badge,
      duration,
      personalChallenge
    } = route.params;

    const now = new Date()
    const lastUpdated = new Date(personalChallenge.updatedAt)
    const created = new Date(personalChallenge.createdAt);
    const currentDay =  Math.floor((now - created) / 86400000)
    console.log(now)
    console.log(lastUpdated)
    console.log("current day",currentDay)

    console.log(now - lastUpdated)
    console.log(now - created);

    const challengeData = []
    const colors = []
    const completeColor = "#ff924c"
    const incompleteColor = "#999"


    for(let i = 0; i < duration; i++) {
      let section = { key: "", y: 1 }
      let color = incompleteColor
      if(i === currentDay && personalChallenge.dailyStatus || i < currentDay) {
        color = completeColor
      }
      challengeData.push(section)
      colors.push(color)
    }
    console.log(personalChallenge.dailyStatus)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenge Tracker!!!!</Text>
      <VictoryPie
        padAngle={5}
        // use to hide labels
        labelComponent={<View />}
        innerRadius={70}
        width={200}
        height={200}
        cornerRadius={10}
        data={challengeData}
        colorScale={colors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },
  container: {
    flex: 1,
  },
});

export default ChallengeTrackerScreen;
