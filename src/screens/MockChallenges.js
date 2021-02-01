import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function MockChallenges() {
    return (
        <View style={styles.container}>
            <Text>THIS IS A MOCK CHALLENGES PAGE FOR TESTING REACT NAVIGATION</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
