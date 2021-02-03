import { blue, green, white } from 'chalk'
import React, { useState} from 'react'
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity} from 'react-native'
import * as firebase from 'firebase'
import { registration } from '../../API/methods'

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const emptyState = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSignUp = () => {
    if (!firstName) {
      Alert.alert('First name is required');
    } else if (!email) {
      Alert.alert('Email field is required.');
    } else if (!password) {
      Alert.alert('Password field is required.');
    } else if (!confirmPassword) {
      setPassword('');
      Alert.alert('Confirm password field is required.');
    } else if (password !== confirmPassword) {
      Alert.alert('Password does not match!');
    } else {
      registration(
        email,
        password,
        lastName,
        firstName,
      );
      navigation.navigate('Loading');
      emptyState();
    }
  };

    return (
      <View style={StyleSheet.container}>
        <Text style={styles.greeting}>{`Hello!\nSign up and get ready to save the world.`}</Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>First Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={firstName => setFirstName({ firstName })}
              value={firstName}>
              </TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Last Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={lastName => setLastName({ lastName })}
              value={lastName}>
              </TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={email => setEmail({ email })}
              value={email}>
              </TextInput>
          </View>
          <View style={{marginTop:32}}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={password => setPassword({ password })}
              value={password}></TextInput>
          </View>

          <View style={{marginTop:32}}>
            <Text style={styles.inputTitle}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={confirmPassword => setPassword({ confirmPassword })}
              value={confirmPassword}></TextInput>
          </View>

        </View>



        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={{color: "green", fontWeight: "500"}}>
            Sign up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => navigation.navigate("Login")}>
          <Text style={{color: "green", fontSize: 13}}>
            Already have an account? <Text style={{fontWeight: "500", color: "red"}}>Log In</Text>
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
    color: "black",
    fontSize: 10,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: "blue",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    color: "black"
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  }
})
