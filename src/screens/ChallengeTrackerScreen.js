import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { VictoryPie } from "victory-native";
import * as firebase from "firebase";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import Svg from "react-native-svg";
import { icons } from "./Icons/icons";

const ChallengeTrackerScreen = ({ route, navigation }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [completed, setCompleted] = useState(
    route.params.personalChallenge.dailyStatus
  );

  let currentUserUID = firebase.auth().currentUser.uid;

  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;

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

  let now = new Date();
  const lastUpdated = new Date(personalChallenge.updatedAt);
  const created = new Date(personalChallenge.createdAt);
  const currentDay = Math.floor((now - created) / 86400000);
  const exactDay = (now - created) / 86400000;
  const challengeData = [];
  const colors = [];
  const completeColor = "#689451";
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

  useEffect(() => {
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
    updateChallenge(currentUserUID, id)
    setCompleted(!completed)
  }, []);



  const completeChallenge = async (userId, challengeId) => {
    const now = new Date();
    const today = now.getDate();
    const updatedDate = lastUpdated.getDate();
    if (!personalChallenge.dailyStatus && today < updatedDate + 3) {
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
      <View style={[styles.header, { paddingVertical: HEIGHT / 13.9 }]}>
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

      <View
        style={{ position: "absolute", top: HEIGHT / 4.22, left: WIDTH / 3.24 }}
      >
        <TouchableOpacity
          onPress={() =>
            completeChallenge(currentUserUID, id)
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
          Day {currentDay + 1} of {duration}
          {personalChallenge.dailyStatus ? ` Complete` : ` Incomplete`}
        </Text>
      </View>
      <View
        style={[
          styles.descriptionBox,
          {
            margin: HEIGHT/30,
            paddingHorizontal: WIDTH/25,
            paddingVertical: HEIGHT/40,
            width: WIDTH/ 1.1,
            top: HEIGHT/4,
          },
        ]}
      >
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
      <View style={[styles.toggleTips, { top: HEIGHT / 4 }]}>
        <TouchableOpacity onPress={() => setModalOpen(true)}>
          <Text style={styles.button}>Tips?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
    color: "#ffffff",
    fontFamily: "Avenir-Book",
    textTransform: "uppercase",
  },
  container: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f2f7f3",
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
    backgroundColor: "#689451",
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
  },
  close: {
    backgroundColor: "#689451",
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
    backgroundColor: "#689451",
  },
  descriptionBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "#689451",
  },
  descriptionText: {
    fontSize: 17,
  },
  header: {
    backgroundColor: "#689451",
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
});

export default ChallengeTrackerScreen;
