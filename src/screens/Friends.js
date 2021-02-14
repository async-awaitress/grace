import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import * as firebase from "firebase";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import { Button } from "react-native-paper";

const Friends = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [request, setRequest] = useState([]);
  const [email, setEmail] = useState("");
  const isFocused = useIsFocused();
  let currentUserUID = firebase.auth().currentUser.uid;

  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;

  useEffect(() => {
    async function getFriends() {
      const res = await EXPRESS_ROOT_PATH.get(
        `/users/friends/accepted/${currentUserUID}`
      );
      const friendsArray = res.data;
      setFriends(friendsArray);
    }
    getFriends();
  }, [isFocused]);

  const getUpdatedFriends = async () => {
    const res = await EXPRESS_ROOT_PATH.get(
      `/users/friends/accepted/${currentUserUID}`
    );
    const friendsArray = res.data;
    setFriends(friendsArray);
  };

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

      const res = await EXPRESS_ROOT_PATH.get(
        `/users/friends/accepted/${currentUserUID}`
      );
      setFriends(res.data);

      const respond = await EXPRESS_ROOT_PATH.get(
        `/users/friends/requests/${currentUserUID}`
      );
      const friendRequests = respond.data;
      setRequest(friendRequests);
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

  const newRequest = async () => {
    const friend = await EXPRESS_ROOT_PATH.get(`/users/email/${email}`);
    try {
      await EXPRESS_ROOT_PATH.put(`/users/friends/${currentUserUID}`, {
        receiverId: friend.data.uid,
      });
    } catch (error) {
      console.log(error);
    }

    return friend;
  };

  const searcher = async () => {
    const friend = await EXPRESS_ROOT_PATH.get(`/users/email/${email}`);
    newRequest();
    console.log("FRIEND", friend.data);
    if (friend.data.email) {
      Alert.alert("Friend Request Sent!");
    } else {
      Alert.alert(`No User With Email: ${email} Exists`);
    }

    setEmail("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
      </View>
      <View style={styles.friendSearch}>
        <SearchBar
          style={styles.input}
          placeholder="   Find Friend By Email"
          onChangeText={(email) => setEmail(email.toLowerCase())}
          value={email}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
        />
        <View style={styles.addFriendButton}>
          <Button onPress={searcher} mode="contained" color="#689451">
            Add Friend
          </Button>
        </View>
      </View>
      <View>
        <View style={styles.pendingHeader}>
          <Text style={styles.pendingHeaderText}>Pending Requests</Text>
        </View>
        <FlatList
          data={request}
          keyExtractor={(friend) => friend.uid}
          renderItem={({ item }) => (
            <View style={styles.friendBox}>
              <View>
                <Image
                  source={require("../../assets/profileMain.png")}
                  style={styles.pendingFriendPhoto}
                />
              </View>
              <View style={[styles.pendingFriendName, { left: WIDTH / 5 }]}>
                <TouchableOpacity>
                  <Text style={styles.pendingFriendNameText}>
                    {item.firstName + " " + item.lastName}
                  </Text>
                </TouchableOpacity>
              </View>
              {currentUserUID === item.friend.senderId ? (
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
              ) : (
                <Text style={styles.pending}>Pending</Text>
              )}
            </View>
          )}
        />
      </View>
      <View>
        <View style={styles.pendingHeader}>
          <Text style={styles.pendingHeaderText}>Friend List</Text>
        </View>
        <View>
          <FlatList
            data={friends}
            keyExtractor={(friend) => friend.uid}
            renderItem={({ item }) => (
              <View style={styles.friendBox}>
                <View>
                  <Image
                    source={require("../../assets/profileMain.png")}
                    style={styles.pendingFriendPhoto}
                  />
                </View>
                <View style={[styles.friendName, { left: WIDTH / 5 }]}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Friend Profile", item)}
                  >
                    <View>
                      <Text style={styles.friendText}>
                        {item.firstName + " " + item.lastName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: "Avenir-Book",
    flex: 1,
    backgroundColor: "#f2f7f3",
  },
  header: {
    backgroundColor: "#689451",
    paddingTop: 50,
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    height: 140,
    fontFamily: "Avenir-Book",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginLeft: 15,
    marginTop: 80,
    textAlign: "center",
    color: "white",
    fontFamily: "Avenir-Book",
    textTransform: "lowercase",
  },
  searchBarContainer: {
    backgroundColor: "#b6d1b6",
    borderColor: "black",
    marginHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
  },
  searchBarInputContainer: {
    backgroundColor: "#b6d1b6",
  },
  input: {
    backgroundColor: "white",
    borderColor: "#b6d1b6",
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    width: 300,
    color: "#363533",
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
  friendSearch: {},
  addFriendButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    backgroundColor: "#689451",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  friendText: {
    fontSize: 20,
    fontStyle: "italic",
    textTransform: "capitalize",
    color: "#f2f7f3",
  },
  friendName: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 35,
    borderRadius: 6,
    zIndex: -1,
    backgroundColor: "#689451",
    shadowColor: "#689451",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.0,
    elevation: 2,
  },
  pending: {
    marginTop: 60,
    color: "grey",
  },
  pendingHeader: {
    fontFamily: "Avenir-Book",
    alignItems: "center",
    backgroundColor: "#394f3c",
    margin: 10,
    borderRadius: 5,
  },
  pendingHeaderText: {
    fontFamily: "Avenir-Book",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  pendingFriendName: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 35,
    borderRadius: 6,
    zIndex: -1,
    backgroundColor: "lightgrey",
    shadowColor: "gray",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.0,
    elevation: 2,
  },
  pendingFriendNameText: {
    fontSize: 20,
    fontStyle: "italic",
    textTransform: "capitalize",
    color: "#363533",
  },
  pendingFriendPhoto: {
    transform: [{ scale: 0.3 }],
    borderRadius: 120,
  },
  title: {
    fontSize: 26.3,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
    color: "#ffffff",
    fontFamily: "Avenir-Book",
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
