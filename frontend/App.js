import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Text, View, Button, AsyncStorage } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

import "react-native-gesture-handler";

import Map from "./screens/Map";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";

const resetAction = StackActions.reset({
  App: App,
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "App" })]
});

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.dispatch(resetAction)}
        />
      </View>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parkings: []
    };
  }
  async componentDidMount() {
    const user_id = await AsyncStorage.getItem("user_id");
    console.log("id", user_id)
    const response = await fetch("http://192.168.1.33:8080/parkingspots");
    const data = await response.json();
    // console.log(data.result);
    this.setState({
      parkings: data.result
    });
  }
  render() {
    return <Map parkings={this.state.parkings} />;
  }
}

const AppNavigator = createStackNavigator(
  {
    App: App,
    DetailsScreen: DetailsScreen,
    SignUp: SignUp,
    Login: Login
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);
