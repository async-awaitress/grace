import React, { useState } from "react";
import {
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import { connect } from "react-redux";

const ChallengeDetailsScreen = ({ route }) => {
  const [bgColor, setBgColor] = useState("lightGray");
  const [headerColor, setHeaderColor] = useState("lightGray");

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
  console.log(route.params);

  console.log(bgColor);

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
    setBgColor("lightpurple");
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

  category === "transport" &&
  bgColor !== "lightpurple" &&
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
          marginLeft: 15,
          marginBottom: 5,
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
      <TouchableOpacity>
        <View
          style={{
            margin: 10,
            backgroundColor: bgColor,
            borderWidth: 2,
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
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
    backgroundColor: "green",
    alignItems: "center",
  },
  container: { flex: 1, alignItems: "center" },
  list: {
    flexDirection: "row",
    padding: 10,
    margin: 5,
    borderWidth: 1,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
  },
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
