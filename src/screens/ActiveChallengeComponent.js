import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { icons } from "./Icons/icons";

const ActiveChallengeComponent = (props) => {
  const { badge, isCompleted, onComplete, challenge, navigation } = props;
  return (
    <View style={styles.activeChallengeInfo}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Challenge Tracker", challenge)}
      >
        <Image source={icons[badge]} style={styles.image} />
      </TouchableOpacity>
      {isCompleted ? (
        <TouchableOpacity
          disabled
          style={styles.completedButtonView}
          onPress={onComplete}
        >
          <Text>Done!</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.completeButtonView}
          onPress={onComplete}
        >
          <Text>Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activeChallengeInfo: {
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
  },
  image: {
    width: 70,
    height: 70,
  },
  completeButtonView: {
    backgroundColor: "lightgreen",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
  completedButtonView: {
    backgroundColor: "orange",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
});

export default ActiveChallengeComponent;
