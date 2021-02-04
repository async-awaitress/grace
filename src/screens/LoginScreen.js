import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import * as firebase from "firebase";
import { signIn } from "../../API/methods";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Email field is required.");
    }

    if (!password) {
      Alert.alert("Password field is required.");
    }

    await signIn(email, password);
    setEmail("");
    setPassword("");
    navigation.navigate("HomePage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome to GRace</Text>

      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>Email Address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(email) => setEmail(email)}
            value={email}
          ></TextInput>
        </View>

        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(password) => setPassword(password)}
          ></TextInput>
        </View>
      </View>
      {/* also, below, onPress, it should navigate to our homePage, which the list of challenges page,but not sure whether I can add another onPress for navigation. Maybe there is a way to enter the navigate in the handler function above. */}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{ color: "black", fontWeight: "500" }}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 32 }}
        onPress={() => navigation.navigate("Registration")}
      >
        <Text style={{ color: "black", fontSize: 13 }}>
          New to GRace?{" "}
          <Text style={{ fontWeight: "500", color: "red" }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 32 }}
        onPress={() => navigation.navigate("GoogleSignIn")}
      >
        <Image
          style={styles.tinyLogo}
          source={{
            uri:
              "https://cdn.shortpixel.ai/client/q_glossy,ret_img,w_960/https://voxytalksy.com/wp-content/uploads/2018/08/google-voxytalksy.png",
          }}
        />
        <Text style={{ color: "black", fontSize: 13 }}>
          Google{" "}
          <Text style={{ fontWeight: "500", color: "red" }}>Sign In</Text>
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
    alignItems: "center",
    justifyContent: "center",
    color: "green",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "green",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    color: "black",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#f4978e",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
