import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from "react-native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import * as firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

const Friends = ({ navigation }) => {
  const [friends, setFriends] = useState([])
  let currentUserUID = firebase.auth().currentUser.uid;

  const WIDTH= Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;

  useEffect(() => {
    async function getFriends() {
      const res = await EXPRESS_ROOT_PATH.get(
        `/users/friends/accepted/${currentUserUID}`
      );
      const friends = res.data
      setFriends(friends)
    }
    getFriends()
  }, [])

console.log('FRIENDS', friends)

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>
    //     Please pardon this page while it's under construction.
    //   </Text>
    //   <Text style={styles.title}>🚧🚧🚧🚧🚧</Text>
    //   <Text style={styles.title}>Friends are coming soon!</Text>
    // </View>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FRIENDS</Text>
      </View>
      <View>
        <FlatList
          data={friends}
          keyExtractor={(friend, index) => index}
          renderItem={({ item }) => (
            <View style={styles.friendBox}>
              <View>
                <Image
                  source={require("../../assets/profilePic.png")}
                  style={{ transform: [{ scale: 0.4 }] }}
                />
              </View>
              <View
                style={{
                  left: WIDTH / 5,
                  borderWidth: 1,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 250,
                  height: 35,
                  borderRadius: 4,
                  zIndex: -1,
                  backgroundColor: "#ff924c",
                }}
              >
                <TouchableOpacity>
                  <Text style={styles.friendText}>
                    {item.firstName + " " + item.lastName}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
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
    backgroundColor: "#ffedd6",
  },
  friendBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 100
  },
  friendText: {
    fontSize: 20,
    fontStyle: "italic",
  },
  header: {
    backgroundColor: "#ff924c",
    paddingTop: 50,
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26.3,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
    color: "#ffffff",
    fontFamily: "Bradley Hand",
    textTransform: "uppercase",
  },
});

export default Friends;
