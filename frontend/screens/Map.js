import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  AsyncStorage
} from "react-native";
import MapView from "react-native-maps";
import Modal from "react-native-modal";
import Dropdown from "react-native-modal-dropdown";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import { API_URL } from "../config";

import * as theme from "../theme";

const { Marker } = MapView;
const { height, width } = Dimensions.get("screen");
const parkingsCapacity = [
  {
    id: 2,
    title: "Parking 01",
    price: 5,
    rating: 4.2,
    capacity: 20,
    available: 10,
    coordinate: {
      latitude: 33.897,
      longitude: 35.503
    },
    description: `Description about this parking lot

Open year 2018
Secure with CCTV`
  },
  {
    id: 2,
    title: "Parking 2",
    price: 7,
    rating: 3.8,
    capacity: 25,
    available: 20,
    coordinate: {
      latitude: 33.8925,
      longitude: 35.505
    },
    description: `Description about this parking lot

Open year 2014
Secure with CCTV`
  },
  {
    id: 3,
    title: "Parking 3",
    price: 10,
    rating: 4.9,
    capacity: 50,
    available: 25,
    coordinate: {
      latitude: 33.895,
      longitude: 35.5063
    },
    description: `Description about this parking lot

Open year 2019
Secure with CCTV`
  }
];

class ParkingMap extends Component {
  state = {
    parkings: [],
    hours: {},
    active: null,
    activeModal: null,
    period: {}
  };

  componentWillMount() {
    const { parkings } = this.props;
    const hours = {};

    parkings.map(parking => {
      hours[parking.parking_spots_id] = 1;
    });
    console.log(hours);
    this.setState({ hours });
  }

  componentWillReceiveProps(nextProps) {
    const { parkings } = nextProps;
    const hours = {};
    parkings.map(parking => {
      hours[parking.parking_spots_id] = 1;
    });
    this.setState({ hours });
  }

  handleHours = (id, value) => {
    const { hours } = this.state;
    hours[id] = value;

    this.setState({ hours });
  };

  renderHeader() {
    return (
      <View style={styles.header}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.headerTitle}>Detected location</Text>
          <Text style={styles.headerLocation}>DOWN TOWN,BEIRUT</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}   >
        </View>
      </View>
    );
  }

  renderParking = item => {
    const { hours } = this.state;
    console.log("hours renderParking", hours);
    const totalPrice = item.price * hours[item.parking_spots_id];

    return (
      <TouchableWithoutFeedback
        key={`parking-${item.parking_spots_id}`}
        onPress={() => this.setState({ active: item.parking_spots_id })}
      >
        <View style={[styles.parking, styles.shadow]}>
          <View style={styles.hours}>
            <Text style={styles.hoursTitle}>
              x {item.capacity} {item.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {this.renderHours(item.parking_spots_id)}
              <Text style={{ color: theme.COLORS.gray }}>hrs</Text>
            </View>
          </View>
          <View style={styles.parkingInfoContainer}>
            <View style={styles.parkingInfo}>
              <View style={styles.parkingIcon}>
                <Ionicons
                  name="ios-pricetag"
                  size={theme.SIZES.icon}
                  color={theme.COLORS.gray}
                />
                <Text style={{ marginLeft: theme.SIZES.base }}>
                  {" "}
                  ${item.price}
                </Text>
              </View>
              <View style={styles.parkingIcon}>
                <Ionicons
                  name="ios-star"
                  size={theme.SIZES.icon}
                  color={theme.COLORS.gray}
                />
                <Text style={{ marginLeft: theme.SIZES.base }}>
                  {" "}
                  {item.rating}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.buy}
              onPress={() => this.setState({ activeModal: item })}
            >
              <View style={styles.buyTotal}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name="dollar"
                    size={theme.SIZES.icon * 1.25}
                    color={theme.COLORS.white}
                  />
                  <Text style={styles.buyTotalPrice}>{totalPrice}</Text>
                </View>
                <Text style={{ color: theme.COLORS.white }}>
                  {item.price}x{hours[item.parking_spots_id]} hrs
                </Text>
              </View>
              <View style={styles.buyBtn}>
                <FontAwesome
                  name="angle-right"
                  size={theme.SIZES.icon * 1.75}
                  color={theme.COLORS.white}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderParkings = () => {
    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        style={styles.parkings}
        data={this.props.parkings}
        extraData={this.state}
        keyExtractor={(item, index) => `${item.parking_spots_id}`}
        renderItem={({ item }) => this.renderParking(item)}
      />
    );
  };

  renderHours(id) {
    const { hours } = this.state;
    const availableHours = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ];

    return (
      <Dropdown
        defaultIndex={0}
        options={availableHours}
        style={styles.hoursDropdown}
        defaultValue={`0${hours[id]}:00` || "01:00"}
        dropdownStyle={styles.hoursDropdownStyle}
        onSelect={(index, value) => this.handleHours(id, value)}
        renderRow={option => (
          <Text style={styles.hoursDropdownOption}>{`0${option}:00`}</Text>
        )}
        renderButtonText={option => `0${option}:00`}
      />
    );
  }
  reserve = async (parking_spots_id, period) => {
    const user_id = await AsyncStorage.getItem("user_id");
    console.log("period", period);
    const response = await fetch(`${API_URL}/createreservation`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id, parking_spots_id, period })
    });
    const result = await response.json();
    console.log("r", result.result);
    Alert.alert(
      "",
      "Your ticket number is: " +
      result.result.ticket +
      "\n" + "\n" + "Your parking spot is in " +
      result.result.parkingSpot.title +
      "\n" + "\n" +
      "Booking period :  " +
      result.result.period + "" +
      " Hours \n" +
      "\n" + "Total price : " + "" +
      result.result.parkingSpot.price * result.result.period +
      " $ \n" + "\n" + "\n" +

      "Note: take a screenshot to show this ticket to employee ",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  renderModal() {
    const { activeModal, hours } = this.state;

    if (!activeModal) return null;

    return (
      <Modal
        isVisible
        useNativeDriver
        style={styles.modalContainer}
        backdropColor={theme.COLORS.overlay}
        onBackButtonPress={() => this.setState({ activeModal: null })}
        onBackdropPress={() => this.setState({ activeModal: null })}
        onSwipeComplete={() => this.setState({ activeModal: null })}
      >
        <View style={styles.modal}>
          <View>
            <Text style={{ fontSize: theme.SIZES.font * 1.5 }}>
              {activeModal.title}
            </Text>
          </View>
          <View style={{ paddingVertical: theme.SIZES.base }}>
            <Text
              style={{
                color: theme.COLORS.gray,
                fontSize: theme.SIZES.font * 1.1
              }}
            >
              {activeModal.description}
            </Text>
          </View>
          <View style={styles.modalInfo}>
            <View
              style={[styles.parkingIcon, { justifyContent: "flex-start" }]}
            >
              <Ionicons
                name="ios-pricetag"
                size={theme.SIZES.icon * 1.1}
                color={theme.COLORS.gray}
              />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}>
                {" "}
                ${activeModal.price}
              </Text>
            </View>
            <View
              style={[styles.parkingIcon, { justifyContent: "flex-start" }]}
            >
              <Ionicons
                name="ios-star"
                size={theme.SIZES.icon * 1.1}
                color={theme.COLORS.gray}
              />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}>
                {" "}
                {activeModal.rating}
              </Text>
            </View>
            <View
              style={[styles.parkingIcon, { justifyContent: "flex-start" }]}
            >
              <Ionicons
                name="ios-pin"
                size={theme.SIZES.icon * 1.1}
                color={theme.COLORS.gray}
              />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}>
                {" "}
                {activeModal.price}km
              </Text>
            </View>
            <View
              style={[styles.parkingIcon, { justifyContent: "flex-start" }]}
            >
              <Ionicons
                name="ios-car"
                size={theme.SIZES.icon * 1.3}
                color={theme.COLORS.gray}
              />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}>
                {" "}
                {activeModal.available}/{activeModal.capacity}
              </Text>
            </View>
          </View>
          <View style={styles.modalHours}>
            <Text style={{ textAlign: "center", fontWeight: "500" }}>
              Choose your Booking Period:
            </Text>
            <View style={styles.modalHoursDropdown}>
              {this.renderHours(activeModal.parking_spots_id)}
              <Text style={{ color: theme.COLORS.gray }}>hrs</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() =>
                this.reserve(
                  activeModal.parking_spots_id,
                  hours[activeModal.parking_spots_id]
                )
              }
            >
              <Text style={styles.payText}>
                {" "}
                Proceed to pay{" "}
                {activeModal.price * hours[activeModal.parking_spots_id]} $
              </Text>

              <FontAwesome
                name="angle-right"
                size={theme.SIZES.icon * 1.75}
                color={theme.COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { currentPosition, parkings } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <MapView initialRegion={currentPosition} style={styles.map}>
          {parkings.map(parking => (
            <Marker
              key={`marker-${parking.parking_spots_id}`}
              coordinate={parking.coordinate}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({ active: parking.parking_spots_id })
                }
              >
                <View
                  style={[
                    styles.marker,
                    styles.shadow,
                    this.state.active === parking.parking_spots_id
                      ? styles.active
                      : null
                  ]}
                >
                  <Text style={styles.markerPrice}>${parking.price}</Text>
                  <Text style={styles.markerStatus}>
                    {" "}
                    ({parking.available}/{parking.capacity})
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </Marker>
          ))}
        </MapView>
        {this.renderParkings()}
        {this.renderModal()}
      </View>
    );
  }
}

ParkingMap.defaultProps = {
  currentPosition: {
    latitude: 33.8985,
    longitude: 35.5063,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121
  },
  parkings: [parkingsCapacity]
};

export default ParkingMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: theme.SIZES.base * 2,
    paddingTop: theme.SIZES.base * 2.5,
    paddingBottom: theme.SIZES.base * 1.5
  },
  headerTitle: {
    color: theme.COLORS.gray
  },
  headerLocation: {
    fontSize: theme.SIZES.font,
    fontWeight: "500",
    paddingVertical: theme.SIZES.base / 3
  },
  map: {
    flex: 3
  },
  parkings: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    paddingBottom: theme.SIZES.base * 2
  },
  parking: {
    flexDirection: "row",
    backgroundColor: theme.COLORS.white,
    borderRadius: 6,
    padding: theme.SIZES.base,
    marginHorizontal: theme.SIZES.base * 2,
    width: width - 24 * 2
  },
  buy: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: theme.SIZES.base * 1.5,
    paddingVertical: theme.SIZES.base,
    backgroundColor: theme.COLORS.red,
    borderRadius: 6
  },
  buyTotal: {
    flex: 1,
    justifyContent: "space-evenly"
  },
  buyTotalPrice: {
    color: theme.COLORS.white,
    fontSize: theme.SIZES.base * 2,
    fontWeight: "600",
    paddingLeft: theme.SIZES.base / 4
  },
  buyBtn: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  marker: {
    flexDirection: "row",
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.base * 2,
    paddingVertical: 12,
    paddingHorizontal: theme.SIZES.base * 2,
    borderWidth: 1,
    borderColor: theme.COLORS.white
  },
  markerPrice: { color: theme.COLORS.red, fontWeight: "bold" },
  markerStatus: { color: theme.COLORS.gray },
  shadow: {
    shadowColor: theme.COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  active: {
    borderColor: theme.COLORS.red
  },
  hours: {
    flex: 1,
    flexDirection: "column",
    marginLeft: theme.SIZES.base / 2,
    justifyContent: "space-evenly"
  },
  hoursTitle: {
    fontSize: theme.SIZES.text,
    fontWeight: "500"
  },
  hoursDropdown: {
    borderRadius: theme.SIZES.base / 2,
    borderColor: theme.COLORS.overlay,
    borderWidth: 1,
    padding: theme.SIZES.base,
    marginRight: theme.SIZES.base / 2
  },
  hoursDropdownOption: {
    padding: 5,
    fontSize: theme.SIZES.font * 0.8
  },
  hoursDropdownStyle: {
    marginLeft: -theme.SIZES.base,
    paddingHorizontal: theme.SIZES.base / 2,
    marginVertical: -(theme.SIZES.base + 1)
  },
  parkingInfoContainer: { flex: 1.5, flexDirection: "row" },
  parkingInfo: {
    justifyContent: "space-evenly",
    marginHorizontal: theme.SIZES.base * 1.5
  },
  parkingIcon: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end"
  },
  modal: {
    flexDirection: "column",
    height: height * 0.75,
    padding: theme.SIZES.base * 2,
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: theme.SIZES.base,
    borderTopRightRadius: theme.SIZES.base
  },
  modalInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: theme.SIZES.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.COLORS.overlay,
    borderBottomColor: theme.COLORS.overlay
  },
  modalHours: {
    paddingVertical: height * 0.11
  },
  modalHoursDropdown: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.SIZES.base
  },
  payBtn: {
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.SIZES.base * 1.5,
    backgroundColor: theme.COLORS.red
  },
  payText: {
    fontWeight: "600",
    fontSize: theme.SIZES.base * 1.5,
    color: theme.COLORS.white
  }
});
