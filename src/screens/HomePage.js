import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as firebase from 'firebase'
import { loggingOut } from '../../API/methods'

export default function HomePage({ navigation }) {


  const [firstName, setFirstName] = useState('');

  let currentUserUID = firebase.auth().currentUser.uid;

  useEffect(() => {
    async function getUserInfo(){
      let doc = await firebase
      .firestore()
      .collection('users')
      .doc(currentUserUID)
      .get();

      if (!doc.exists){
        Alert.alert('No user data found!')
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName)
      }
    }
    getUserInfo();
  })

  const handlePress = () => {
    loggingOut();
    navigation.navigate('Login');
  };

  const challenges = [
    {
      id: 1,
      title: "Water Warrior",
      category: "water",
      duration: 7,
      pointsPerDay: 2,
      description: "Take shower for less than 5 minutes",
    },
    {
      id: 2,
      title: "Waste Warrior",
      category: "waste",
      duration: 5,
      pointsPerDay: 1,
      description:
        "Don't use disposable or single use containers, bottles, utensils",
    },
    {
      id: 3,
      title: "Transit Warrior",
      category: "transportation",
      duration: 14,
      pointsPerDay: 2,
      description:
        "Instead of taking a car - walk, bike or take public transportation",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home (placeholder)</Text>
      </View>
      <ScrollView>
        <View style={styles.activeChalengesContainer}>
          <Text>Hello, {firstName}</Text>
          <Text style={styles.activeChallengesHeader}>Active Challenges</Text>
          <ScrollView horizontal={true}>
            {/* Three FlatLists are used here to achieve a mockup Effect of horizontal scroll witrh limited data.  It will be replaced by a map that makes a new FlatList for every 3-5 active challenges */}
            <FlatList
              data={challenges}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.title}
                  </Text>
                  <TouchableOpacity style={styles.completeButtonView}>
                    <Text>Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <FlatList
              data={challenges}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.title}
                  </Text>
                  <TouchableOpacity style={styles.completeButtonView}>
                    <Text>Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <FlatList
              data={challenges}
              renderItem={(challengeData) => (
                <View style={styles.activeChallengeInfo}>
                  <Text style={styles.challengeText}>
                    {challengeData.item.title}
                  </Text>
                  <TouchableOpacity style={styles.completeButtonView}>
                    <Text>Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ScrollView>
        </View>
        <View style={styles.linkView}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Personal Challenges")}
          >
            <Text>View Personal Challenges</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkView}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Friend Challenges")}
          >
            <Text>View Friend Challenges</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
          < Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "green",
    padding: 10,
    width: "100%",
  },
  headerText: {
    fontSize: 40,
  },
  activeChallengesContainer: {
    flexDirection: "column",
    flex: 1,
  },
  activeChallengesHeader: {
    fontSize: 30,
  },
  activeChallengeInfo: {
    flexDirection: "row",
    margin: 5,
    borderWidth: 1,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
  },
  challengeText: {
    fontSize: 20,
  },
  linkView: {
    alignItems: "center",
    padding: 10,
    marginVertical: 20,
    backgroundColor: "lightgreen",
    borderWidth: 1,
  },
  completeButtonView: {
    backgroundColor: "lightgreen",
    borderLeftWidth: 1,
  },
});
