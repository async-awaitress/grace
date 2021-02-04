import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { VictoryPie } from "victory-native";
import * as firebase from "firebase";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";

const ChallengeTrackerScreen = ({ route, navigation }) => {
  let currentUserUID = firebase.auth().currentUser.uid;

  const {
    id,
    category,
    description,
    pointsPerDay,
    title,
    type,
    badge,
    duration,
    personalChallenge,
  } = route.params;

  console.log(route.params);

  console.log("DAILY STATUS", personalChallenge.dailyStatus);

  let now = new Date();
  const lastUpdated = new Date(personalChallenge.updatedAt);
  const created = new Date(personalChallenge.createdAt);
  const currentDay = Math.floor((now - created) / 86400000);

  const challengeData = [];
  const colors = [];
  const completeColor = "#ff924c";
  const incompleteColor = "#999";

  for (let i = 0; i < duration; i++) {
    let section = { key: "", y: 1 };
    let color = incompleteColor;
    if ((i === currentDay && personalChallenge.dailyStatus) || i < currentDay) {
      color = completeColor;
    }
    challengeData.push(section);
    colors.push(color);
  }
  // console.log(personalChallenge.dailyStatus);

  const updateChallenge = async (userId, challengeId) => {
    now = new Date();
    if (personalChallenge.dailyStatus && now - lastUpdated > 86400000 * 2) {
      console.log("USER DIDN'T CHECK")
    } else if (personalChallenge.dailyStatus && now - lastUpdated > 86400000) {
      try {
        const res = await axios.put(
          `${EXPRESS_ROOT_PATH}/api/personalChallenges/resetPersonalChallenge/${challengeId}`,
          { uid: userId }
        );
        // dailyStatus = "true"
        const dailyStatus = res.data.dailyStatus;
        console.log(dailyStatus);
      } catch (error) {
        console.log("update request failed", error);
      }
    } else if (personalChallenge.dailyStatus && now - lastUpdated < 86400000) {
      console.log("Task Already Completed Today!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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
      <View>
        <Image source={require(`../../assets/bag-c.png`)} />
        {/* <Image source={`../.${badge}.png`} />
        <Image source={icon} /> */}
      </View>
      <View style={styles.infoContainer}>
        <Text>{description}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => updateChallenge(currentUserUID, id)}>
          <Text>RESET</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
  },
  infoContainer: {
    borderWidth: 1,
    width: "80%",
  },
});

export default ChallengeTrackerScreen;
