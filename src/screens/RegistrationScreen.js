import { blue, green, white } from 'chalk'
import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import * as firebase from 'firebase'
import { registration } from '../../API/methods'

export default class RegistrationScreen extends React.Component {

  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    errorMessage: null
  }

 handleSignUp = () => {
  registration(this.email, this.password, this.firstName, this.lastName)
  this.props.navigation.navigate("Home")
 }

  render(){
    return (
      <View style={StyleSheet.container}>
        <Text style={styles.greeting}>{`Hello!\nSign up and get ready to save the world.`}</Text>


        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={styles.error}>{this.errorMessage}</Text>}
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>First Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={firstName => this.setState({ firstName })}
              value={this.state.email}>
              </TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Last Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={lastName => this.setState({ lastName })}
              value={this.state.email}>
              </TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}>
              </TextInput>
          </View>
          <View style={{marginTop:32}}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}></TextInput>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{color: "green", fontWeight: "500"}}>
            Sing up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => this.props.navigation.navigate("Login")}>
          <Text style={{color: "green", fontSize: 13}}>
            Already have an account? <Text style={{fontWeight: "500", color: "red"}}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>

    )
  }
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
    borderBottomColor: "blue",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    color: yellow
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
