import React from "react";
import Constants from "expo-constants";
// import * as Permissions from "expo-permissions";
// import * as ImagePicker from "expo-image-picker";

import {
  View,
  Image,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";

export default class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };


  Login = async () => {

    const response = await fetch(`http://192.168.1.33:8080/login?email=${this.state.email}&password=${this.state.password}`)
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
    }
    else {
      const login_response = await this.Login();

      if (login_response) {
        this.props.navigation.navigate("App")
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
      <ScrollView style={{ padding: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

        </View>
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
