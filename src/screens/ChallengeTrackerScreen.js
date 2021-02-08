import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { VictoryPie } from "victory-native";
import * as firebase from "firebase";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import Svg from "react-native-svg";
import { icons } from "./Icons/icons";

const ChallengeTrackerScreen = ({ route, navigation }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [completed, setCompleted] = useState(route.params.personalChallenge.dailyStatus);

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
    tips,
  } = route.params;

  // console.log(route.params);

  // console.log("DAILY STATUS", personalChallenge.dailyStatus);

  let now = new Date();
  const lastUpdated = new Date(personalChallenge.updatedAt);
  const created = new Date(personalChallenge.createdAt);
  const currentDay = Math.floor((now - created) / 86400000);
  const exactDay = (now - created) / 86400000;
  // console.log("CURRENT DAY", currentDay);
  // console.log("EXACT DAY", exactDay);

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

  useEffect(() => {
    updateChallenge(currentUserUID, id).then
    (setCompleted(!completed)).then
    (console.log(completed));
  }, []);

  const updateChallenge = async (userId, challengeId) => {
    const now = new Date();
    const today = now.getDate();
    const updatedDate = lastUpdated.getDate();
    // CHANGE BELOW LINE TO toady === updatedDate IF TESTING FOR SAME DAY
    if (today === updatedDate + 1 && personalChallenge.dailyStatus) {
      console.log("PAST MIDNIGHT, RESET COMPLETION TO FALSE");
      try {
        const res = await EXPRESS_ROOT_PATH.put(
          `/personalChallenges/resetPersonalChallenge/${challengeId}`,
          { uid: userId }
        );
        // dailyStatus = "true"
      } catch (err) {
        console.log(err);
      }
    }
    if (today >= updatedDate + 2 && !personalChallenge.dailyStatus) {
      try {
        const res = await EXPRESS_ROOT_PATH.put(
          `/personalChallenges/failPersonalChallenge/${challengeId}`,
          { uid: userId }
        );
        // dailyStatus = "true"
        const dailyStatus = res.data.dailyStatus;
      } catch (err) {
        console.log(err);
      }
    }
  };

  const completeChallenge = async (userId, challengeId) => {
    const now = new Date();
    const today = now.getDate();
    const updatedDate = lastUpdated.getDate();
    if (
      !personalChallenge.dailyStatus &&
      today < updatedDate + 3
    ) {
      try {
        const res = await EXPRESS_ROOT_PATH.put(
          `/personalChallenges/updatePersonalChallenge/${challengeId}`,
          { uid: userId }
        );
        // dailyStatus = "true"
      } catch (error) {
        console.log("update request failed", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
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

      <View style={{ position: "absolute", top: 69, left: 142 }}>

        <TouchableOpacity
          onPress={() =>
            completeChallenge(currentUserUID, id).then(setCompleted(!completed))
          }
        >
          <Image
            style={{ transform: [{ scale: 0.65 }] }}
            source={icons[badge]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.daysCounter}>
        <Text style={styles.daysCounterText}>
          Day {currentDay + 1} of {duration}{" "}
          {personalChallenge.dailyStatus ? `Complete` : `Incomplete`}
        </Text>
      </View>
      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionText}>{description}</Text>
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
      </View>
      <View style={styles.toggleTips}>
        <TouchableOpacity onPress={() => setModalOpen(true)}>
          <Text style={styles.button}>Tips?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26.3,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
    color: "#ffffff",
    fontFamily: "Bradley Hand",
    textTransform: "uppercase",
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
    fontWeight: "bold",
  },
  daysCounter: {
    top: 130,
  },
  daysCounterText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  modal: {
    backgroundColor: "#ff924c",
  },
  descriptionBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    marginTop: 10,
    padding: 10,
    borderRadius: 15,
    width: 350,
    paddingHorizontal: 5,
    top: 150,
    borderColor: "#ff924c",
  },
  descriptionText: {
    fontSize: 17,
  },
  header: {
    backgroundColor: "#ff924c",
    paddingTop: 40,
    padding: 15,
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
});

export default ChallengeTrackerScreen;
