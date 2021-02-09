import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList} from "react-native";
import * as firebase from "firebase";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios"
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { loggingOut } from "../../API/methods";

const ProfileScreen = ({ navigation }) => {

  const isFocused = useIsFocused();
  const [user, setUser] = useState({});
  const [challenges, setChallenges] = useState([])
  const handlePress = async () => {
    await loggingOut()
    firebase.auth().onAuthStateChanged((user) => {
       if (!user) {

         navigation.replace('Login')
       }
      })
  }

  let currentUserUID = firebase.auth().currentUser.uid;
  console.log("UID", currentUserUID)

  useEffect(()=> {
    async function getChallenges() {
      try {
        const res = await EXPRESS_ROOT_PATH.get(`/personalChallenges/${currentUserUID}`)
  const completedChallenges = res.data
         setCompletedChallenges(setCompletedChallenges)
      } catch (error) {

      }
    }
  })

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await EXPRESS_ROOT_PATH.get(`/users/${currentUserUID}`);
        setUser(res.data)

      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchUser();
  }, []);


  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  let date = new Date(user.createdAt)
  let joinedDate = date.toLocaleDateString(undefined, options)
  console.log(joinedDate);
  console.log("points", user.totalPoints)



  return (
    <View style={styles.container}>
      <View style={{width: 370, height: 230, backgroundColor: '#a7f9ef', borderRadius: 20, borderWidth: 6, borderColor: "#9deaff", shadowOffset:{  width: 10,  height: 10,  },
      shadowColor: '#9deaff', shadowOpacity: 0.5}}>
        <View style={{width: 40, height: 20, backgroundColor: 'white', borderRadius: 10, margin: 10, alignSelf: "flex-end"}}/>
        <View>
          <Text style={styles.totalPoints}>{`Total Points\n${user.totalPoints}`}</Text>
        </View>
        <View>
          <Text style={styles.createdAt}>{`Joined Date\n${joinedDate}`}</Text>
        </View>
          <Text style={styles.name}>{user.firstName}</Text>
      </View>



      <View style={{width: 370, height: 230, backgroundColor: '#fdffb6', margin: 7, borderRadius: 20, borderWidth: 6, borderColor: "#e4ffbb", shadowOffset:{  width: 10,  height: 10,  },
      shadowColor: '#e4ffbb', shadowOpacity: 1.0}}>
        <View style={{width: 40, height: 20, backgroundColor: 'white', borderRadius: 10, margin: 10, alignSelf: "flex-end"}}/>
        <View>
          <Text style={{padding: 6}}>My goals</Text>
        </View>
        <View>
          <Text style={{padding: 6}}>Completed Challenges</Text>
        </View>
      </View>

      <Image
        style={styles.tinyLogo}
        source={require("../../assets/profilePic.png")}/>

      <View style={{width: 370, height: 210, backgroundColor: '#ff87ab', margin: 7, borderRadius: 20, borderWidth: 6, borderColor: "#ff5d8f", shadowOffset:{  width: 10,  height: 10,  },
      shadowColor: '#ff5d8f', shadowOpacity: 0.5}}>
        <View style={{width: 40, height: 20, backgroundColor: 'white', borderRadius: 10, margin: 10, alignSelf: "flex-end"}}/>
        <View>
          <Text style={{padding: 6}}>Badges Earned</Text>
        </View>

        <ScrollView
          style={styles.badgesEarned}
          horizontal={true}
          >
            <FlatList/>
              {/* <FlatList
                horizontal
                data={challenges}
                keyExtractor={(challenge) => challenge.id}
                renderItem={({ item }) => (
                  <View style={styles.activeChallengeInfo}>
                    <Text style={styles.challengeText}>{item.title}</Text>
                    <Text>{item.category}</Text>

                    <TouchableOpacity
                      onPress={() =>
                      navigation.navigate("Challenge Tracker", item)
                    }
                    >
                    <Image
                      source={icons[item.badge]}
                      style={{ width: 70, height: 70 }}
                    />

                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={dailyCompletion[item.id]}
                      style={
                        dailyCompletion[item.id]
                          ? styles.completedButtonView
                          : styles.completeButtonView
                      }
                      onPress={() => updateChallenge(currentUserUID, item.id)}
                    >
                      {dailyCompletion[item.id] ? (
                        <Text>Done!</Text>
                      ) : (
                        <Text>Complete</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              /> */}
            </ScrollView>
      </View>
      <View style={{width: 70, height: 30, backgroundColor: 'black', margin: 2, borderRadius: 20, borderWidth: 6, borderColor: "#ff5d8f", shadowOffset:{  width: 10,  height: 10,  },
      shadowColor: '#ff5d8f', shadowOpacity: 0.5}}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={{color: "white"}}> Log out</Text>
        </TouchableOpacity>
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
    top: 40,
    paddingTop: 40,
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  tinyLogo: {
    top: 150,
    padding: 30,
    margin: 10,
    overflow: "visible",
    borderRadius: 150 / 2,
    borderWidth: 10,
    borderColor: "white",
    alignSelf: "center",
    position: "absolute"
  },
  button: {
    marginHorizontal: 50,
    backgroundColor: "#bdb2ff",
    borderRadius: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  createdAt: {
    textAlign: "right",
    paddingTop: 10,
    paddingRight: 6,
    fontWeight: "bold"
  },
  totalPoints: {
   textAlign: "right",
   paddingTop: 10,
   paddingRight: 6,
   fontWeight: "bold"
  },
  name: {
    color: "black",
    position: "absolute",
    padding: 2,
    fontSize: 16,
    fontWeight: "bold",
    left: 10,
    bottom: -70,
    height: "50%",
  },
  badgesEarned: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    width: 360,
    height: 150,
    color: "white"
  },
});

export default ProfileScreen;
