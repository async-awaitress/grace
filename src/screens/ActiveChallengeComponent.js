import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { icons } from "./Icons/icons";
import { Button } from "react-native-paper";

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
        // <TouchableOpacity
        //   disabled={isCompleted}
        //   style={styles.completedButtonView}
        //   onPress={onComplete}
        // >
        //   <Text>Done!</Text>
        // </TouchableOpacity>
        <Button
          mode="contained"
          compact
          disabled={isCompleted}
          onPress={onComplete}
          color="orange"
          style={{ marginVertical: 2, width: 85 }}
          labelStyle={{ fontSize: 11 }}
        >
          Done!
        </Button>
      ) : (
        // <TouchableOpacity
        //   style={styles.completeButtonView}
        //   onPress={onComplete}
        // >
        //   <Text>Complete</Text>
        // </TouchableOpacity>
        <Button
          mode="contained"
          compact
          disabled={isCompleted}
          onPress={onComplete}
          style={{ width: 85 }}
          color="lightgreen"
          style={{ marginVertical: 2, width: 85 }}
          labelStyle={{ fontSize: 11 }}
        >
          Complete
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activeChallengeInfo: {
    flexDirection: "column",
    margin: 5,
    // borderWidth: 2,
    borderRadius: 20,
    // borderColor: "#f2f7f3",
    backgroundColor: "white",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    height: 170,
    width: 110,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.0,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 20,
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
