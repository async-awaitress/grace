import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import { VictoryPie } from "victory-native";
import * as firebase from "firebase";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import Svg from "react-native-svg";

const ChallengeTrackerScreen = ({ route, navigation }) => {
  const [modalOpen, setModalOpen] = useState(false)

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
    tips
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
      console.log("USER DIDN'T CHECK");
      try {
        const res = await axios.put(
          `${EXPRESS_ROOT_PATH}/api/personalChallenges/failPersonalChallenge/${challengeId}`,
          { uid: userId }
        );
        // dailyStatus = "true"
        const completionStatus = res.data.completionStatus;
        console.log(completionStatus);
      } catch (error) {
        console.log("update request failed", error);
      }
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
      <Svg height="50" width="200">
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
      </Svg>

      <View style={{ position: "absolute", top: 69, left: 115.5 }}>
        <Image
          style={{ transform: [{ scale: 0.65 }] }}
          source={require(`../../assets/bag-c.png`)}
        />
        {/* <Image source={`../.${badge}.png`} />
        <Image source={icon} /> */}
      </View>
      <View style={styles.descriptionHeader}>
        <Text style={styles.descriptionHeaderText}>Description</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text>{description}</Text>
      </View>
      <View style={styles.reset}>
        <TouchableOpacity onPress={() => updateChallenge(currentUserUID, id)}>
          <Text style={styles.resetButton}>RESET(test)</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Modal visible={modalOpen} animationType="slide">
          <View style={styles.tips}>
            <Text style={styles.popupText}>{tips}</Text>
            <View style={styles.close}>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Text style={styles.button}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.toggleTips}>
          <TouchableOpacity onPress={() => setModalOpen(true)}>
            <Text style={styles.button}>Tips?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    backgroundColor: "#ffedd6",
  },
  infoContainer: {
    borderWidth: 1,
    width: "80%",
    top: 200,
  },
  reset: {
    top: 300,
    backgroundColor: "red",
    borderRadius: 5,
    borderWidth: 1,
  },
  descriptionHeader: {
    top: 175,
  },
  descriptionHeaderText: {
    fontSize: 25,
  },
  tips: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 50,
  },
  popupText: {
    fontSize: 20,
  },
  toggleTips: {
    top: 200,
    backgroundColor: "#ff924c",
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
  },
  close: {
    backgroundColor: "#ff924c",
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
  },
  button: {
    fontSize: 17,
  },
  resetButton: {
    fontSize: 50,
    fontWeight: 'bold'
  },
});

export default ChallengeTrackerScreen;
