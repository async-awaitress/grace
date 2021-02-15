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

const FriendChallengeTrackerScreen = ({ route, navigation }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [challenge, setChallenge] = useState({});

  let currentUserUID = firebase.auth().currentUser.uid;

  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;

  const {
    id,
    senderId,
    receiverId,
    challengeId,
    dailyStatusForSender,
    dailyStatusForReceiver,
    totalPointsToWin,
    senderUpdated,
    receiverUpdated,
    createdAt,
    updatedAt,
    badge,
  } = route.params;

  const [receiverCompleted, setReceiverCompleted] = useState(receiverCompleted);
  const [senderCompleted, setSenderCompleted] = useState(senderCompleted);

  useEffect(() => {
    async function getChallenge() {
      const currentChallenge = await EXPRESS_ROOT_PATH.get(
        `/challenges/singlechallenge/${challengeId}`
      );
      setChallenge(currentChallenge.data);
    }
    getChallenge();
  }, []);

  const { title, duration, pointsPerDay, description, tips } = challenge;

  let now = new Date();
  // const lastUpdated = new Date(updatedAt);
  const created = new Date(createdAt);
  const currentDay = Math.floor((now - created) / 86400000);
  const exactDay = (now - created) / 86400000;
  const challengeData = [];
  const colors = [];
  const completeColor = "#689451";
  const incompleteColor = "#999";

  if (currentUserUID === senderId) {
    for (let i = 0; i < duration; i++) {
      let section = { key: "", y: 1 };
      let color = incompleteColor;
      if ((i === currentDay && dailyStatusForSender) || i < currentDay) {
        color = completeColor;
      }
      challengeData.push(section);
      colors.push(color);
    }
  }

  if (currentUserUID === receiverId) {
    for (let i = 0; i < duration; i++) {
      let section = { key: "", y: 1 };
      let color = incompleteColor;
      if ((i === currentDay && dailyStatusForReceiver) || i < currentDay) {
        color = completeColor;
      }
      challengeData.push(section);
      colors.push(color);
    }
  }

  useEffect(() => {
    const updateChallenge = async () => {
      let canUpdate = false;
      let lastUpdated;
      const now = new Date();
      const today = now.getDate();
      // const updatedDate = lastUpdated.getDate();
      // CHANGE BELOW LINE TO toady === updatedDate IF TESTING FOR SAME DAY

      if (currentUserUID === senderId) {
        lastUpdated = senderUpdated.getDate();
        if (lastUpdated > today) {
          canUpdate = true;
        }
      }

      if (currentUserUID === receiverId) {
        lastUpdated = receiverUpdated.getDate();
        if (lastUpdated > today) {
          canUpdate = true;
        }
      }

      if (canUpdate) {
        await EXPRESS_ROOT_PATH.put(
          `/friendchallenges/update/${challengeId}/${currentUserUID}`
        );
      }

      // if (today === updatedDate + 1 && dailyStatusForReceiver) {
      //   console.log("PAST MIDNIGHT, RESET COMPLETION TO FALSE");
      //   try {
      //     const res = await EXPRESS_ROOT_PATH.put(
      //       `/personalChallenges/resetPersonalChallenge/${challengeId}`,
      //       { uid: userId }
      //     );
      //     // dailyStatus = "true"
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }
      // if (today >= updatedDate + 2 && !dailyStatusForReceiver) {
      //   try {
      //     const res = await EXPRESS_ROOT_PATH.put(
      //       `/personalChallenges/failPersonalChallenge/${challengeId}`,
      //       { uid: userId }
      //     );
      //     // dailyStatus = "true"
      //     const dailyStatus = res.data.dailyStatusForReceiver;
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }
    };
    updateChallenge();
    if (currentUserUID === senderId) {
      setSenderCompleted(!senderCompleted);
    }

    if (currentUserUID === receiverId) {
      setReceiverCompleted(!receiverCompleted);
    }
  }, []);

  const RecieverStatusView = () => {
    return (
      <View style={styles.daysCounter}>
        <Text style={styles.daysCounterText}>
          Day {currentDay + 1} of {duration}
          {dailyStatusForReceiver ? ` Complete` : ` Incomplete`}
        </Text>
      </View>
    );
  };

  const SenderStatusView = () => {
    return (
      <View style={styles.daysCounter}>
        <Text style={styles.daysCounterText}>
          Day {currentDay + 1} of {duration}
          {dailyStatusForSender ? ` Complete` : ` Incomplete`}
        </Text>
      </View>
    );
  };

  // const completeChallenge = async (userId, challengeId) => {
  //   const now = new Date();
  //   const today = now.getDate();
  //   const updatedDate = lastUpdated.getDate();
  //   if (!dailyStatusForReceiver && today < updatedDate + 3) {
  //     try {
  //       const res = await EXPRESS_ROOT_PATH.put(
  //         `/personalChallenges/updatePersonalChallenge/${challengeId}`,
  //         { uid: userId }
  //       );
  //       // dailyStatus = "true"
  //     } catch (error) {
  //       console.log("update request failed", error);
  //     }
  //   }
  // };

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
          // onPress={() =>
          //   completeChallenge(currentUserUID, id).then(
          //     setReceiverCompleted(!receiverCompleted)
          //   )
          // }
          >
            <Image
              style={{ transform: [{ scale: 0.65 }] }}
              source={icons[badge]}
            />
          </TouchableOpacity>
        </View>
      </View>
      {currentUserUID === senderId ? SenderStatusView() : RecieverStatusView()}
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
    fontSize: 20,
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
    margin: 20,
  },
  popupText: {
    fontSize: 20,
  },
  toggleTips: {
    padding: 5,
  },
  close: {
    padding: 5,
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
    backgroundColor: "#ff924c",
  },
  descriptionBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    // borderWidth: 2,
    borderRadius: 15,
    // borderColor: "#ff924c",
    borderColor: "#689451",
    width: 300,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#689451",
    shadowOpacity: 0.5,
  },
  descriptionText: {
    fontSize: 17,
  },
});

export default FriendChallengeTrackerScreen;
