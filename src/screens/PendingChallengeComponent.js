import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { icons } from "./Icons/icons";

const PendingChallengeComponent = (props) => {
  const { badge } = props;
  return (
    <View style={styles.pendingChallengeInfo}>
      <Image source={icons[badge]} style={styles.image} />
      <View style={styles.pendingButtonView}>
        <Text style={{ color: "white" }}>Pending</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
  },
  pendingChallengeInfo: {
    flexDirection: "column",
    margin: 5,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#ffedd6",
    backgroundColor: "white",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    height: 170,
    width: 110,
    opacity: 0.5,
  },
  pendingButtonView: {
    backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
});

export default PendingChallengeComponent;
