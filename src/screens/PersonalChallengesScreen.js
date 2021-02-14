import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  LogBox,
} from "react-native";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";
import { icons } from "./Icons/icons";

const PersonalChallengesScreen = ({ navigation }) => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await EXPRESS_ROOT_PATH.get(`/challenges`);
        setChallenges(res.data);
      } catch (error) {
        console.log("get request failed", error);
      }
    }
    fetchData();
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Personal</Text>
        <Text style={styles.headerText}>Challenges</Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <FlatList
            data={challenges.filter(
              (challenge) => challenge.type === "personal"
            )}
            keyExtractor={(challenge) => challenge.id.toString()}
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
    </View>
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
    height: 1500,
  },
  list: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    // borderWidth: 1,
    // backgroundColor: "#f9f1f1",
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.0,
    elevation: 2,
  },
  header: {
    backgroundColor: "#ff924c",
    paddingTop: 35,
    padding: 5,
    width: "100%",
    textAlign: "center",
  },
  headerText: {
    fontSize: 30,
    color: "white",
    marginTop: 5,
    fontFamily: "Bradley Hand",
    textTransform: "uppercase",
    textAlign: "center",
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
