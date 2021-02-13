import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import * as firebase from "firebase";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";

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
    newRequest()
    console.log('FRIEND', friend.data)
    if (friend.data.email) {
      Alert.alert("Friend Added");
    } else {
      Alert.alert(`No User With Email: ${email} Exists`);
    }

    setEmail("");
    forceUpdate()
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FRIENDS</Text>
      </View>
      <View style={styles.friendSearch}>
        <SearchBar
          style={styles.input}
          placeholder="   Find Friend By Email"
          onChangeText={(email) => setEmail(email)}
          value={email}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
        />
        <View style={styles.addFriendButton}>
          <TouchableOpacity onPress={searcher}>
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View>
          <FlatList
            data={friends}
            keyExtractor={(friend) => friend.uid}
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
                    source={require("../../assets/profilePic.png")}
                    style={{ transform: [{ scale: 0.4 }] }}
                  />
                </View>
                <View style={[styles.pendingFriendName, { left: WIDTH / 5 }]}>
                  <TouchableOpacity>
                    <Text style={styles.friendText}>
                      {item.firstName + " " + item.lastName}
                    </Text>
                  </TouchableOpacity>
                </View>
                {currentUserUID === item.friend.senderId ? (
                  <View style={styles.buttons}>
                    <View style={styles.accept}>
                      <TouchableOpacity onPress={() => acceptFriend(item.uid)}>
                        <Feather
                          name={"check-circle"}
                          size={20}
                          color={"blue"}
                        />
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
  friendSearch: {},
  addFriendButton: {
    alignItems: "center",
  },
  buttonText: {
    borderWidth: 1,
    backgroundColor: "orange",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
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
  pendingFriendName: {
    borderWidth: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 35,
    borderRadius: 4,
    zIndex: -1,
    backgroundColor: "lightgrey",
  },
  header: {
    backgroundColor: "#ff924c",
    paddingTop: 50,
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    color: "black",
    marginHorizontal: 40,
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 10,
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
  pending: {
    marginTop: 60,
    color: "grey",
  },
  pendingHeader: {
    alignItems: "center",
    backgroundColor: "#333333",
    marginHorizontal: 10,
    borderRadius: 5,
  },
  pendingHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  searchBarContainer: {
    // backgroundColor: "#ffedd6",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginHorizontal: 20,
    borderRadius: 5
  },
  searchBarInputContainer: {
    // backgroundColor: "#ffedd6",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginVertical: 5
  },
});

export default Friends;
