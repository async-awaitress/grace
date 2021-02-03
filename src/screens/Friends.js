import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Friends = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends!!!</Text>
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
    flex: 1,
  },
});

export default Friends;