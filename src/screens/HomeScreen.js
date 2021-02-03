import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import * as firebase from 'firebase'
import { loggingOut } from "../../API/methods"

export default class HomeScreen extends React.Component {
  state = {
    email: "",
    firstName: ""
  }

  componentDidMount(){
    const {email, displayName} = firebase.auth().currentUser
    this.setState({email, firstName})
  }

  signOutUser = () => {
    loggingOut()
    //navigation.replace("Home")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi {this.state.email}</Text>

        <TouchableOpacity style={{marginTop: 32}} onPress={this.signOutUser}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
