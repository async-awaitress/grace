import { blue, green, white } from "chalk";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as firebase from "firebase";
import { registration } from "../../API/methods";
import axios from "axios";
import { EXPRESS_ROOT_PATH } from "../api/grace";


export default function RegistrationScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emptyState = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignUp = async () => {
    if (!firstName) {
      Alert.alert("First name is required");
    } else if (!email) {
      Alert.alert("Email field is required.");
    } else if (!password) {
      Alert.alert("Password field is required.");
    } else if (password.length < 6){
      Alert.alert("Password needs to be at least six characters long")
    } else if (!confirmPassword) {
      setPassword("");
      Alert.alert("Confirm password field is required.");
    } else if (password !== confirmPassword) {
      Alert.alert("Password does not match!");
    } else {
      await registration(email, password, lastName, firstName);
      let currentUserUID = firebase.auth().currentUser.uid;
      await EXPRESS_ROOT_PATH.post(`/users`, {
        uid: currentUserUID,
        firstName,
        lastName,
        email
      });
      navigation.navigate("HomePage");
      emptyState();
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={styles.greeting}
      >{`Hello!\nSign up and get ready to save the world.`}</Text>

      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>First Name</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={firstName}
            onChangeText={(firstName) => setFirstName(firstName)}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.inputTitle}>Last Name</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={lastName}
            onChangeText={(lastName) => setLastName(lastName)}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.inputTitle}>Email Address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={email}
            onChangeText={(email) => setEmail(email)}
          ></TextInput>
        </View>
        <View style={{ marginTop: 5 }}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(password) => setPassword(password)}
          ></TextInput>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.inputTitle}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
          ></TextInput>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={{ color: "green", fontWeight: "500" }}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 32 }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ color: "green", fontSize: 13 }}>
          Already have an account?
          <Text style={{ fontWeight: "500", color: "red" }}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    paddingTop: 30,
    paddingBottom: 30,
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  error: {
    color: "red",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginBottom: 40,
    marginHorizontal: 30,
  },
  inputTitle: {
    paddingTop: 15,
    color: "black",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "blue",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    color: "black",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
