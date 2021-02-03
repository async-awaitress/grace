import React from 'react';
import { Text, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';

export default class AuthScreen extends React.Component {
  state = { user: null };
  componentDidMount() {
    this.initAsync();
  }
  initAsync = async () => {
    await GoogleSignIn.initAsync({
//wondering whether I can get the clientId without writing it here directly. I think GoogleService-info.plist should be in .gitignored!!!
    clientId: '226134016336-o0gtq1ppdouodlvmqq3ndjka47rjtvks.apps.googleusercontent.com',
    });
    this._syncUserWithStateAsync();
  };
  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ user });
  };
  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };
  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };
  onPress = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };
  render() {

    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={this.onPress}>
          <Text style={{color: "green", fontWeight: "500"}}>
           Google Sign In
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  }
})
