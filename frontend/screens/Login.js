import React from "react";
import Constants from "expo-constants";
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform, ImageBackground
} from "react-native";

import { resetAction } from "../App";
import LoginImage from "../assets/login.png"
import { API_URL } from "../config";
export default class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  Login = async () => {
    const response = await fetch(
      `${API_URL}/login?email=${this.state.email}&password=${this.state.password}`
    );
    const login = await response.json();
    console.log("data", login);
    console.log("data.suc", login.success);
    if (login.success) {
      AsyncStorage.setItem("user_id", JSON.stringify(login.result));
    }
    return login.success;
  };

  _onPress = async () => {
    if (
      // !this.state.username &&
      !this.state.password &&
      // !this.state.avatar &&
      this.state.email
    ) {
      alert("Complete your login");
      return false;
    } else {
      const login_response = await this.Login();

      if (login_response) {
        // this.props.navigation.navigate("App");
        this.props.navigation.dispatch(resetAction);
        // Actions.profile();
      } else {
        alert("Please check your email && password");
      }
    }
  };
  componentDidMount() {
    // this.getPermissionAsync();
  }

  // getPermissionAsync = async () => {
  //   if (Constants.platform.ios) {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     if (status !== "granted") {
  //       alert("Sorry, we need camera roll permissions to make this work!");
  //     }
  //   }
  // };
  /***
   * Pick Image
   */

  // pickImage = async () => {
  //   const options = {
  //     noData: true
  //   };
  //   let result = await ImagePicker.launchImageLibraryAsync(options);
  //   console.log(result);
  //   if (result.uri) {
  //     this.setState({ avatar: result });
  //   }
  // };
  render() {
    // let avatar = this.state.avatar;
    return (
      <ImageBackground source={LoginImage} style={{ flex: 1, width: null, height: 150, resizeMode: "covere" }}>

        <ScrollView style={{ padding: 30 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          ></View>
          <KeyboardAvoidingView style={{ marginTop: 100 }}>
            <TextInput
              style={styles.input}
              placeholder="Email:"
              autoCapitalize="none"
              placeholderTextColor="white"
              onChangeText={val => this.onChangeText("email", val)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password:"
              secureTextEntry={true}
              autoCapitalize="none"
              placeholderTextColor="white"
              onChangeText={val => this.onChangeText("password", val)}
            />

            <Button title="Login" onPress={this._onPress} />
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>

    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 55,
    backgroundColor: "#42A5F5",
    margin: 10,
    color: "white",
    borderRadius: 14
  }
});
