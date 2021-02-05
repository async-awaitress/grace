import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as firebase from "firebase";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios"
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { loggingOut } from "../../API/methods";

const ProfileScreen = ({ navigation }) => {

  const isFocused = useIsFocused();
  const [user, setUser] = useState({});

  let currentUserUID = firebase.auth().currentUser.uid;
  console.log("UID", currentUserUID)


  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${EXPRESS_ROOT_PATH}/api/users/${currentUserUID}`);
        const user = res.data
        setUser(user)

      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchUser();
  }, []);

  // const handlePress = () => {
  //   loggingOut();
  //   navigation.replace("Login");
  // };

  const date = new Date(user.createdAt).getDate()
  const month = new Date(user.createdAt).getMonth()
  const year = new Date(user.createdAt).getYear()
  const joinedDate = `${month}/${date}/${year}`

  return (
    <View style={styles.container}>
      <View style={{width: 400, height: 200, backgroundColor: '#a7f9ef', borderRadius: 10}} />

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
        <Text style={styles.myGoals}>My goals</Text>
      </View>

      <View>
        <Text style={styles.completed}>Completed Challenges</Text>
      </View>

      <View>
        <Text style={styles.badges}>Badges Earned</Text>
      </View>

      {/* <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
      </View> */}
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
  button: {
    marginHorizontal: 50,
    backgroundColor: "#9bf6ff",
    borderRadius: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  name: {
    color: "black",
    fontSize: 12,
  }
});

export default ProfileScreen;
