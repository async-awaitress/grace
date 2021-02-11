import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { icons } from "./Icons/icons";

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

      <Button title="Accept" onPress={onAccept}></Button>
      <Button title="Decline" onPress={onDecline}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    opacity: 0.5,
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
  },
  acceptButtonView: {
    backgroundColor: "green",
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
