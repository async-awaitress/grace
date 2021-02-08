import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Friends = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Please pardon this page while it's under construction.
      </Text>
      <Text style={styles.title}>🚧🚧🚧🚧🚧</Text>
      <Text style={styles.title}>Friends are coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 80,
    textAlign: "center",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
});

export default Friends;
