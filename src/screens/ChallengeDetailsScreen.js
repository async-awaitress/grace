import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import axios from "axios";
import * as firebase from "firebase";

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
  } = route.params;

  const setWasteTheme = () => {
    setBgColor("lightgreen");
    setHeaderColor("green");
  };

  const setWaterTheme = () => {
    setBgColor("lightskyblue");
    setHeaderColor("blue");
  };

  const setEnergyTheme = () => {
    setBgColor("lightyellow");
    setHeaderColor("yellow");
  };

  const setTransportTheme = () => {
    setBgColor("mediumpurple");
    setHeaderColor("purple");
  };

  const setFoodTheme = () => {
    setBgColor("lightred");
    setHeaderColor("red");
  };

  category === "waste" && bgColor !== "lightgreen" && headerColor !== "green"
    ? setWasteTheme()
    : null;
  category === "water" && bgColor !== "lightskyblue" && headerColor !== "blue"
    ? setWaterTheme()
    : null;
  category === "energy" && bgColor !== "lightyellow" && headerColor !== "yellow"
    ? setEnergyTheme()
    : null;

  category === "transportation" &&
  bgColor !== "mediumpurple" &&
  headerColor !== "purple"
    ? setTransportTheme()
    : null;

  category === "food" && bgColor !== "lightred" && headerColor !== "red"
    ? setFoodTheme()
    : null;

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          width: "80%",
          backgroundColor: headerColor,
          alignItems: "center",
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: bgColor,
          width: "80%",
          alignItems: "center",
        }}
      >
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {duration} Days / {pointsPerDay} Points Per Day
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={async () => {
          // "aaa" is temporary user uid (id), it will be replaced while we have logged user information
          await addPersonalChallengeHandler(currentUserUID, id);
          navigation.navigate("HomePage");
        }}
      >
        <View
          style={{
            margin: 10,
            backgroundColor: bgColor,
            borderWidth: 3,
            borderColor: headerColor,
          }}
        >
          <Text style={styles.descriptionText}>
            {type === "personal" ? "Start Challenge" : "Challenge A Friend"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 10 },
  allInfo: {
    backgroundColor: "lightgray",
    width: "80%",
    alignItems: "center",
  },
  statsText: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "lightcoral",
  },
  stats: {
    borderWidth: 1,
    width: "100%",
  },
  descriptionText: {
    fontSize: 20,
  },
});

export default ChallengeDetailsScreen;
