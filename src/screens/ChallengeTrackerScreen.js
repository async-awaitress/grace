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
import { Button } from "react-native-paper";

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

          const dailyStatus = res.data.dailyStatus;
        } catch (err) {
          console.log(err);
        }
      }
    };
    updateChallenge(currentUserUID, id);
    setCompleted(!completed);
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
      } catch (error) {
        console.log("update request failed", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: HEIGHT / 28,
        }}
      >
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

        <View
          style={{
            position: "absolute",
          }}
        >
          <TouchableOpacity
            onPress={() => completeChallenge(currentUserUID, id)}
          >
            <Image
              style={{
                transform: [{ scale: 0.65 }],
              }}
              source={icons[badge]}
            />
          </TouchableOpacity>
        </View>
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
            margin: HEIGHT / 30,
            paddingHorizontal: WIDTH / 25,
            paddingVertical: HEIGHT / 40,
            width: WIDTH / 1.1,
            top: HEIGHT / 5,
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
              <Button
                color="#689451"
                mode="contained"
                onPress={() => setModalOpen(false)}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </View>
      <View style={[styles.toggleTips, { top: HEIGHT / 5 }]}>
        <Button
          color="#689451"
          mode="contained"
          onPress={() => setModalOpen(true)}
        >
          Tips
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#689451",
    paddingTop: 35,
    padding: 10,
    width: "100%",
    textAlign: "center",
    height: 100,
  },
  headerText: {
    fontSize: 30,
    color: "white",
    marginTop: 5,
    fontFamily: "Avenir-Book",
    textAlign: "center",
    textTransform: "capitalize",
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
    padding: 20,
  },
  popupText: {
    fontSize: 20,
  },
  toggleTips: {
    borderRadius: 5,
  },
  close: {
    marginTop: 30,
    borderRadius: 5,
  },
  button: {
    fontSize: 17,
  },
  resetButton: {
    fontSize: 50,
    fontWeight: "bold",
  },
  daysCounter: {
    top: 50,
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
});

export default ChallengeTrackerScreen;
