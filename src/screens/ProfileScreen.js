import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as firebase from "firebase";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios"
import { EXPRESS_ROOT_PATH } from "../api/grace";

const ProfileScreen = ({ navigation }) => {

  const isFocused = useIsFocused();
  const [user, setUser] = useState({});

  let currentUserUID = firebase.auth().currentUser.uid;
  console.log("UID", currentUserUID)


  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${EXPRESS_ROOT_PATH}/api/users/${currentUserUID}`);

        setUser(res.data)

      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchUser();
  }, []);

  const date = new Date(user.createdAt).getDate()
  const month = new Date(user.createdAt).getMonth()
  const year = new Date(user.createdAt).getYear()
  const joinedDate = `${month}/${date}/${year}`

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page!</Text>

      <View>
        <Text style={styles.name}>{user.firstName}</Text>
      </View>

      <View>
        <Text style={styles.totalPoints}>Total Points: {user.totalPoints}</Text>
      </View>

      <View>
        <Text style={styles.createdAt}>Joined Date: {joinedDate}</Text>
      </View>

      <View>
        <Text style={styles.createdAt}>My goals</Text>
      </View>

      <View>
        <Text style={styles.createdAt}>Completed Challenges</Text>
      </View>

      <View>
        <Text style={styles.createdAt}>Badges Earned</Text>
      </View>


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
  name: {
    color: "black",
    fontSize: 12,

  }
});

export default ProfileScreen;
