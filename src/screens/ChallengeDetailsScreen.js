import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import axios from "axios";
import * as firebase from "firebase";
import { icons } from "./Icons/icons";

const ChallengeDetailsScreen = ({ route, navigation }) => {
  const [bgColor, setBgColor] = useState("lightGray");
  const [headerColor, setHeaderColor] = useState("lightgray");
  const currentUserUID = firebase.auth().currentUser.uid;

  const addPersonalChallengeHandler = async (userId, challengeId) => {
    try {
      await axios.post(
        `${EXPRESS_ROOT_PATH}/api/personalChallenges/add/${challengeId}`,
        { uid: userId }
      );
      console.log("Challenge added to datatabse");
    } catch (error) {
      console.log("accept challenge rejected", error);
    }
  };

  const {
    id,
    category,
    description,
    pointsPerDay,
    title,
    type,
    badge,
    duration,
    tips,
  } = route.params;

  const setWasteTheme = () => {
    setBgColor("lightgreen");
    setHeaderColor("#7cc13a");
  };

  const setWaterTheme = () => {
    setBgColor("lightskyblue");
    setHeaderColor("#1982c4");
  };

  const setEnergyTheme = () => {
    setBgColor("lightyellow");
    setHeaderColor("#ffca3a");
  };

  const setTransportTheme = () => {
    setBgColor("mediumpurple");
    setHeaderColor("#6a4c93");
  };

  const setFoodTheme = () => {
    setBgColor("#f5c4c4");
    setHeaderColor("#f4555a");
  };

  category === "waste" && bgColor !== "lightgreen" && headerColor !== "#7cc13a"
    ? setWasteTheme()
    : null;
  category === "water" &&
  bgColor !== "lightskyblue" &&
  headerColor !== "#1982c4"
    ? setWaterTheme()
    : null;
  category === "energy" &&
  bgColor !== "lightyellow" &&
  headerColor !== "#ffca3a"
    ? setEnergyTheme()
    : null;

  category === "transportation" &&
  bgColor !== "mediumpurple" &&
  headerColor !== "#6a4c93"
    ? setTransportTheme()
    : null;

  category === "food" && bgColor !== "#f5c4c4" && headerColor !== "#f4555a"
    ? setFoodTheme()
    : null;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Challenge</Text>
        <Text style={styles.headerText}>Details</Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View
            style={[styles.challengeContainer, { borderColor: headerColor }]}
          >
            <Image source={icons[badge]} style={styles.badge} />
            <Text style={styles.title}>{title}</Text>
            <View style={styles.allInfo}>
              <View style={styles.stats}>
                <Text style={styles.statsText}>Duration: {duration} Days</Text>
                <Text style={styles.statsText}>
                  {pointsPerDay} Points Per Day
                </Text>
              </View>
              <View style={styles.stats}>
                <Text style={styles.descriptionText}>{description}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={async () => {
              // "aaa" is temporary user uid (id), it will be replaced while we have logged user information
              if (type === "personal") {
                await addPersonalChallengeHandler(currentUserUID, id);
              }
              // else {
              //   await addFriendChallengeHandler(currentUserUID, id)
              // }
              Alert.alert(
                "Challenge Accepted!",
                type === "personal"
                  ? "You Got This!"
                  : "Choose Your Friend On The Next Page",
                [
                  {
                    text: "ok",
                    onPress: () => navigation.navigate("Home"),
                  },
                ]
              );
            }}
          >
            <View
              style={[
                styles.button,
                { backgroundColor: bgColor, borderColor: headerColor },
              ]}
            >
              <Text style={styles.buttonText}>
                {type === "personal" ? "Start Challenge" : "Challenge A Friend"}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.tips, { borderColor: headerColor }]}>
            <Text style={[styles.tipsText, { fontSize: 20, paddingBottom: 2 }]}>
              TIPS
            </Text>
            <Text style={styles.tipsText}>{tips}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ff924c",
    paddingTop: 50,
    padding: 5,
    width: "100%",
    textAlign: "center",
  },
  headerText: {
    fontSize: 30,
    color: "white",
    marginTop: 5,
    fontFamily: "Bradley Hand",
    textTransform: "uppercase",
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#ffedd6",
    height: 1000,
  },
  challengeContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 3,
    marginTop: 20,
    padding: 10,
    borderRadius: 15,
    width: 350,
  },
  allInfo: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontFamily: "Bradley Hand",
    fontSize: 35,
    fontWeight: "bold",
    width: "80%",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 15,
  },
  badge: {
    margin: 10,
    marginBottom: 30,
    width: 100,
    height: 100,
  },
  statsText: {
    fontFamily: "Bradley Hand",
    fontSize: 20,
    margin: 5,
  },

  descriptionText: {
    fontFamily: "Bradley Hand",
    padding: 20,
    fontSize: 20,
    textAlign: "center",
  },
  button: {
    display: "flex",
    margin: 20,
    borderWidth: 3,
    borderRadius: 30,
    padding: 8,
    paddingHorizontal: 30,
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "Bradley Hand",
    fontSize: 20,
    textAlign: "center",
  },
  tips: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    marginTop: 10,
    padding: 10,
    borderRadius: 15,
    width: 350,
    paddingHorizontal: 5,
  },
  tipsText: {
    textAlign: "center",
  },
});

export default ChallengeDetailsScreen;
