import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  Dimensions,
  // Button,
} from "react-native";
import * as firebase from "firebase";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { loggingOut } from "../../API/methods";
import { icons } from "./Icons/icons";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import Base64ArrayBuffer from "base64-arraybuffer";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ProfileScreen = ({ navigation }) => {
  const [image, setImage] = useState(image);
  const isFocused = useIsFocused();
  const [user, setUser] = useState({});
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [completedFriendChallenges, setCompletedFriendChallenges] = useState(
    []
  );

  const handlePress = async () => {
    await loggingOut();
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        navigation.replace("Login");
      }
    });
  };

  useEffect(() => {
    async function fetchUser() {
      let currentUserUID = firebase.auth().currentUser.uid;
      try {
        const res = await EXPRESS_ROOT_PATH.get(`/users/${currentUserUID}`);
        setUser(res.data);
        setImage(res.data.image);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchUser();
  }, [isFocused]);

  useEffect(() => {
    async function getCompletedChallenges() {
      let currentUserUID = firebase.auth().currentUser.uid;
      try {
        const res = await EXPRESS_ROOT_PATH.get(
          `/challenges/completedChallenges/${currentUserUID}`
        );
        setCompletedChallenges(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getCompletedChallenges();
  }, [isFocused]);

  // get all active friend challenges of the user
  useEffect(() => {
    const fetchFriendChallenges = async () => {
      let currentUserUID = firebase.auth().currentUser.uid;
      try {
        const allFriendChallenges = await EXPRESS_ROOT_PATH.get(
          `/friendChallenges/${currentUserUID}`
        );
        const completedFriendChallenges = allFriendChallenges.data.filter(
          (challenge) => challenge.completionStatus === "completed"
        );
        setCompletedFriendChallenges(completedFriendChallenges);
      } catch (error) {
        console.log("there was an error fetching the challenges", error);
      }
    };
    fetchFriendChallenges();
  }, [isFocused]);

  const options = { year: "numeric", month: "long", day: "numeric" };
  let date = new Date(user.createdAt);
  let joinedDate = date.toLocaleDateString(undefined, options);

  let status;
  if (user.totalPoints < 100) {
    status = "Pico Racer";
  } else if (user.totalPoints < 200) {
    status = "Nano Racer";
  } else if (user.totalPoints < 400) {
    status = "Micro Racer";
  } else if (user.totalPoints < 600) {
    status = "Mili Racer";
  } else if (user.totalPoints < 800) {
    status = "Deci Racer";
  } else if (user.totalPoints < 1000) {
    status = "Deka Racer";
  } else {
    status = "Hecta Racer";
  }

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      await EXPRESS_ROOT_PATH.put(`/users/imageUpdate/${user.uid}`, {
        image: result.uri,
      });
    }
    const { data } = await EXPRESS_ROOT_PATH.get(
      `/users/imageUpdate/${user.uid}`
    );
    setImage(data.image);
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 2000 }}>
        <ScrollView vertical>
          <View style={styles.topBox}>
            {/* <View style={styles.shine} /> */}
            <Text style={styles.status}>{status}</Text>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
          </View>

          <View style={styles.midBox}>
            <Text style={styles.totalPoints}>Total Points</Text>

            <View style={styles.numberBox}>
              <Text style={styles.totalPointsNumber}>{user.totalPoints}</Text>
            </View>
            <Text style={styles.badgesEarned}>Badges Earned</Text>

            {/* <View style={styles.shine} /> */}

            <ScrollView horizontal={true}>
              <FlatList
                horizontal
                data={completedChallenges}
                renderItem={({ item }) => (
                  <View style={styles.completedChallenges}>
                    <TouchableOpacity>
                      <Image
                        source={icons[item.badge]}
                        style={styles.badgeImg}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index}
              />

              <FlatList
                horizontal
                data={completedFriendChallenges}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity>
                      <Image
                        source={icons[item.badge]}
                        style={styles.badgeImg}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index}
              />
            </ScrollView>

            <Text style={styles.createdAt}>{`Join Date: ${joinedDate}`}</Text>
          </View>

          <View style={styles.ImageContainer}>
            <Button onPress={pickImage} mode="text" color="gray">
              <Feather name="edit" size={20} />
              edit photo
            </Button>
            {user.image ? (
              <Image
                source={{ uri: `data:image/jpg;base64,${image}` }}
                style={styles.profileImg}
              />
            ) : (
              <Image
                style={styles.profileImg}
                source={require("../../assets/profileMain.png")}
              />
            )}
          </View>

          <Button
            // mode="contained"
            color="#689451"
            onPress={handlePress}
            style={{ marginTop: 5 }}
          >
            Log out
          </Button>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 20,
    paddingTop: 20,
    display: "flex",
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    height: 3000,
  },

  topBox: {
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    width: 0.9 * WIDTH,
    height: 0.27 * HEIGHT,
    backgroundColor: "#e1f2e5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#689451",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#689451",
    shadowOpacity: 0.5,
    margin: 10,
  },
  status: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
    color: "#363533",
    fontWeight: "bold",
    fontFamily: "Avenir-Book",
  },
  name: {
    color: "#689451",
    marginTop: 8,
    padding: 2,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
    fontFamily: "Avenir-Book",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },

  ImageContainer: {
    flex: 1,
    borderRadius: 150 / 2,
    top: 130,
    position: "absolute",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#689451",
    shadowOpacity: 0.5,
    alignSelf: "center",
  },
  profileImg: {
    borderRadius: 150 / 2,
    width: 150,
    height: 150,
  },
  midBox: {
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    borderColor: "#689451",
    width: 0.9 * WIDTH,
    height: 0.5 * HEIGHT,
    backgroundColor: "#e1f2e5",
    margin: 7,
    borderRadius: 20,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#689451",
    shadowOpacity: 0.5,
  },
  totalPoints: {
    paddingTop: 90,
    textAlign: "center",
    paddingRight: 6,
    fontSize: 25,
    color: "#363533",
    fontFamily: "Avenir-Book",
  },
  numberBox: {
    borderRadius: 10,
    margin: 5,
    backgroundColor: "#689451",
  },
  totalPointsNumber: {
    textAlign: "center",
    alignSelf: "center",
    color: "white",
    fontSize: 30,
    padding: 5,
  },
  badgesEarned: {
    paddingTop: 20,
    fontSize: 25,
    color: "#363533",
    fontFamily: "Avenir-Book",
  },
  badgeImg: {
    margin: 5,
    width: 50,
    height: 50,
  },
  shine: {
    width: 40,
    height: 20,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    alignSelf: "flex-end",
  },

  button: {
    marginHorizontal: 50,
    backgroundColor: "#bdb2ff",
    borderRadius: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  createdAt: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: 11,
    color: "#363533",
    fontFamily: "Avenir-Book",
  },
});

export default ProfileScreen;
