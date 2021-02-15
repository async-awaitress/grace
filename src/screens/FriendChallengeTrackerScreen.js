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
  const completeColor = "#ff924c";
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
      {currentUserUID === senderId ? SenderStatusView() : RecieverStatusView()}
      <View
        style={[
          styles.descriptionBox,
          {
            margin: HEIGHT / 30,
            paddingHorizontal: WIDTH / 25,
            paddingVertical: HEIGHT / 40,
            width: WIDTH / 1.1,
            top: HEIGHT / 4,
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
    backgroundColor: "#ffedd6",
  },
  tips: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 50,
  },
  popupText: {
    fontSize: 20,
    fontFamily: "Avenir-Book",
  },
  toggleTips: {
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
    fontFamily: "Avenir-Book",
  },
  resetButton: {
    fontSize: 50,
    fontWeight: "bold",
    fontFamily: "Avenir-Book",
  },
  daysCounter: {
    top: 130,
  },
  daysCounterText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Avenir-Book",
  },
  modal: {
    backgroundColor: "#ff924c",
  },
  descriptionBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "#ff924c",
  },
  descriptionText: {
    fontSize: 17,
    fontFamily: "Avenir-Book",
  },
  header: {
    backgroundColor: "#ff924c",
    paddingTop: 50,
    padding: 15,
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
});

export default FriendChallengeTrackerScreen;
