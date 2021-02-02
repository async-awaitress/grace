import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";

const FriendChallengesScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Friend Challenges</Text>
      <FlatList
        data={challenges}
        keyExtractor={(challenge) => challenge.id}
        renderItem={({ item }) => {
          if (item.type === "friend") {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("Challenge Details", item)}
              >
                <View style={styles.list}>
                  <Text>{item.title}</Text>
                  <Text>
                    {item.duration} days / {item.pointsPerDay} points per day
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
      ></FlatList>
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
    flex: 1,
  },
  list: {
    flexDirection: "row",
    padding: 10,
    margin: 5,
    borderWidth: 1,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
  },
});

export default FriendChallengesScreen;
