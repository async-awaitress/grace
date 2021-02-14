import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { icons } from "./Icons/icons";
import { Button } from "react-native-paper";

const PendingChallengeComponent = (props) => {
  const { badge } = props;
  return (
    <View style={styles.pendingChallengeInfo}>
      <Image source={icons[badge]} style={styles.image} />
      <Button mode="contained" compact disabled>
        Pending
      </Button>
      {/* <View style={styles.pendingButtonView}>
        <Text style={{ color: "white" }}>Pending</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    marginBottom: 20,
    opacity: 0.3,
  },
  pendingChallengeInfo: {
    flexDirection: "column",
    margin: 5,
    // borderWidth: 2,
    borderRadius: 20,
    // borderColor: "#ffedd6",
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
