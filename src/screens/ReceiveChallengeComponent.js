import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { icons } from "./Icons/icons";
import { Button } from "react-native-paper";

const ReceiveChallengeComponent = (props) => {
  const { badge, onAccept, onDecline } = props;
  return (
    <View style={styles.pendingChallengeInfo}>
      <Image source={icons[badge]} style={styles.image} />
      {/* <View style={styles.acceptButtonView}>
        <Text style={{ color: "white" }}>Accept</Text>
      </View>

      <View style={styles.ignoreButtonView}>
        <Text style={{ color: "white" }}>Ignore</Text>
      </View> */}
      {/* <View styles={{ marginBottom: 5, borderWidth: 1 }}> */}
      <Button
        mode="outlined"
        onPress={onAccept}
        compact
        color="green"
        style={{ marginVertical: 2, width: 85 }}
        labelStyle={{ fontSize: 10 }}
      >
        Accept
      </Button>
      <Button
        mode="outlined"
        onPress={onDecline}
        compact
        color="tomato"
        style={{ marginVertical: 2, width: 85 }}
        labelStyle={{ fontSize: 10 }}
      >
        Decline
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    marginBottom: 5,
    opacity: 0.3,
  },
  pendingChallengeInfo: {
    flexDirection: "column",
    margin: 5,
    borderRadius: 20,
    backgroundColor: "white",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
    height: 160,
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
  acceptButtonView: {
    backgroundColor: "#689451",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
  ignoreButtonView: {
    backgroundColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    marginTop: 20,
  },
});

export default ReceiveChallengeComponent;
