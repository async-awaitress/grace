import React, { useState }from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import * as firebase from 'firebase'
import { signIn } from '../../API/methods'


export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email) {
      Alert.alert('Email field is required.');
    }

    if (!password) {
      Alert.alert('Password field is required.');
    }

    signIn(email, password);
    setEmail('');
    setPassword('');
    navigation.navigate("HomePage")
  };

    return (
      <View style={StyleSheet.container}>
        <Text style={styles.greeting}>Welcome to GRace</Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={email => setEmail(email)}
              value={email}>
              </TextInput>
          </View>
          <View style={{marginTop:32}}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={password => setPassword( password)}
              value={password}></TextInput>
          </View>
        </View>
{/* also, below, onPress, it should navigate to our homePage, which the list of challenges page,but not sure whether I can add another onPress for navigation. Maybe there is a way to enter the navigate in the handler function above. */}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{color: "black", fontWeight: "500"}}>
            Sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => navigation.navigate("Registration")}>
          <Text style={{color: "black", fontSize: 13}}>
            New to GRace? <Text style={{fontWeight: "500", color: "red"}}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center"
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  },
  error: {
    color: "red",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },
  form: {
    marginBottom: 40,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "green",
    fontSize: 10,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: "green",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    color: "black"
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#f4978e",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  }
})
