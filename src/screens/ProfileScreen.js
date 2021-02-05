import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },
  container: {
    paddingTop: 40,
    flex: 1,
    alignItems: "center"
  },
});

export default ProfileScreen;
