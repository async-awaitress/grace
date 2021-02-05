import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { icons } from "./Icons/icons";

const PersonalChallengesScreen = ({ navigation }) => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${EXPRESS_ROOT_PATH}/api/challenges`);
        setChallenges(res.data);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <FlatList
          data={challenges.filter((challenge) => challenge.type === "personal")}
          keyExtractor={(challenge) => challenge.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("Challenge Details", item)}
              >
                <View style={styles.list}>
                  <Text style={styles.challengeTitle}>{item.title}</Text>
                  <Image source={icons[item.badge]} style={styles.badge} />
                </View>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
  },
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ffedd6",
    height: 1000,
  },
  list: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    backgroundColor: "#f9f1f1",
    justifyContent: "space-between",
    borderRadius: 20,
    alignItems: "center",
  },
  challengeTitle: {
    fontSize: 25,
    fontWeight: "300",
    fontFamily: "Bradley Hand",
  },
  badge: {
    height: 70,
    width: 70,
  },
});

export default PersonalChallengesScreen;
