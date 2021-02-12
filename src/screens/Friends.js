import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import * as firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const Friends = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [request, setRequest] = useState([]);
  const isFocused = useIsFocused();
  let currentUserUID = firebase.auth().currentUser.uid;

  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;

  useEffect(() => {
    async function getFriends() {
      const res = await EXPRESS_ROOT_PATH.get(
        `/users/friends/accepted/${currentUserUID}`
      );
      const friends = res.data;
      setFriends(friends);
    }
    getFriends();
  }, [isFocused]);

  useEffect(() => {
    async function getRequest() {
      const res = await EXPRESS_ROOT_PATH.get(
        `/users/friends/requests/${currentUserUID}`
      );
      const friendRequests = res.data;
      setRequest(friendRequests);
    }
    getRequest();
  }, [isFocused]);

  const acceptFriend = async (id) => {
    try {
      const senderId = id;
      const statusOfFriendship = "accepted";
      await EXPRESS_ROOT_PATH.put(`users/friends/response/${currentUserUID}`, {
        senderId,
        statusOfFriendship,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const rejectFriend = async (id) => {
    try {
      const senderId = id;
      const statusOfFriendship = "declined";
      await EXPRESS_ROOT_PATH.put(`users/friends/response/${currentUserUID}`, {
        senderId,
        statusOfFriendship,
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log("FRIENDS", friends);


  return (
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
              <View style={[styles.friendName, { left: WIDTH / 5 }]}>
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
      <View>
        <Text>Pending Requests</Text>
        <FlatList
          data={request}
          keyExtractor={(friend, index) => index}
          renderItem={({ item }) => (
            <View style={styles.friendBox}>
              <View>
                <Image
                  source={require("../../assets/profilePic.png")}
                  style={{ transform: [{ scale: 0.4 }] }}
                />
              </View>
              <View style={[styles.friendName, { left: WIDTH / 5 }]}>
                <TouchableOpacity>
                  <Text style={styles.friendText}>
                    {item.firstName + " " + item.lastName}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttons}>
                <View style={styles.accept}>
                  <TouchableOpacity onPress={() => acceptFriend(item.uid)}>
                    <Feather name={"check-circle"} size={20} color={"blue"} />
                  </TouchableOpacity>
                </View>
                <View style={styles.reject}>
                  <TouchableOpacity onPress={() => rejectFriend(item.uid)}>
                    <Feather name={"x-circle"} size={20} color={"red"} />
                  </TouchableOpacity>
                </View>
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
  buttons: {
    flexDirection: "row",
    marginTop: 60,
  },
  friendBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 100,
  },
  friendText: {
    fontSize: 20,
    fontStyle: "italic",
  },
  friendName: {
    borderWidth: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 35,
    borderRadius: 4,
    zIndex: -1,
    backgroundColor: "#ff924c",
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
  accept: {
    paddingHorizontal: 10,
  },
  reject: {
    paddingHorizontal: 10,
  },
});

export default Friends;
