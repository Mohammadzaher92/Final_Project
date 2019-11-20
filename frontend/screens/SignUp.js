import React from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

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
import { API_URL } from "../config";
export default class SignUp extends React.Component {
  state = {
    username: "",
    password: "",
    email: "",
    avatar: null,
    confirmPassword: ""
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  //Sign up

  SignUp = async () => {
    let formData = new FormData();
    const uri = this.state.avatar.uri;
    const uriParts = uri.split(".");
    const fileName = uriParts[uriParts.length - 1];
    formData.append("avatar", {
      name: `photo.${fileName}`,
      type: `image/${fileName}`,
      uri:
        Platform.OS === "android"
          ? this.state.avatar.uri
          : this.state.avatar.uri.replace("file://", "")
    });
    formData.append("username", this.state.username);
    formData.append("password", this.state.password);
    formData.append("email", this.state.email);
    console.log(formData);
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: formData
    });
    const data = await response.json();
    console.log("data", data);
    console.log("data.suc", data.success);
    if (data.success) {
      AsyncStorage.setItem("user", JSON.stringify(data.user));
    }
    return data.success;
  };

  _onPress = async () => {
    if (
      !this.state.username &&
      !this.state.password &&
      !this.state.avatar &&
      this.state.email
    ) {
      alert("Complete your Sign up");
      return false;
    }
    if (this.state.password != this.state.confirmPassword) {
      alert("Conform Your Password");
      return false;
    } else if (this.state.avatar === null) {
      alert("Please add you plate image");
    } else {
      console.log("hsh");
      const signup_response = await this.SignUp();

      if (signup_response) {
        // Actions.profile();
      } else {
        alert("Please check your credential");
      }
    }
  };
  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  /***
   * Pick Image
   */

  pickImage = async () => {
    const options = {
      noData: true
    };
    let result = await ImagePicker.launchImageLibraryAsync(options);
    console.log(result);
    if (result.uri) {
      this.setState({ avatar: result });
    }
  };
  render() {
    let avatar = this.state.avatar;
    return (
      <ScrollView style={{ padding: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity>
            <Button title="Pick an image" onPress={this.pickImage} />
          </TouchableOpacity>
          {avatar && (
            <Image
              source={{ uri: avatar.uri }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
          )}
        </View>

        <KeyboardAvoidingView style={{ marginTop: 60 }}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={val => this.onChangeText("username", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={val => this.onChangeText("password", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Your Password"
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={val => this.onChangeText("confirmPassword", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={val => this.onChangeText("email", val)}
          />

          <Button title="Sign Up" onPress={this._onPress} />
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
