// stable
import React, { Component } from "react";
import _ from "lodash";
import { Container, Text, Spinner } from "native-base";
import { NavigationActions } from "react-navigation";
import { StatusBar, View, Platform, StyleSheet } from "react-native";
import Cards from "./../../containers/cards";
import OneSignal from "react-native-onesignal";
import LocationProvider from "./../../containers/locationProvider";
import Header from "../../components/header";

export default class Home extends Component {
  state = {
    redirected: false
  }
  componentWillMount() {
    OneSignal.addEventListener("opened", this.onOpened);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener("opened", this.onOpened);
  }
  onOpened = openResult => {
    if (!this.state.redirected) {
      if (
        _.get(openResult, "notification.payload.additionalData.source") ===
        "message"
      ) {
        // Redirect to the match screen
        this.setState(
          {
            redirected: true
          },
          () => this.props.navigation.navigate("Match")
        );
      }
      if (
        _.get(openResult, "notification.payload.additionalData.source") ===
        "chat"
      ) {
        const match = _.get(
          openResult,
          "notification.payload.additionalData.match"
        );
        if (match && match.id) {
          // Redirect to the chat screen
          this.setState(
            {
              redirected: true
            },
            () => this.resetToChat(match)
          );
        } else {
          this.setState(
            {
              redirected: true
            },
            () => this.props.navigation.navigate("Match")
          );
        }
      }
    }
  }
  resetToChat = match => {
    return this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({
            routeName: "Home"
          }),
          NavigationActions.navigate({
            routeName: "Chat",
            params: {
              match
            }
          })
        ],
        key: null
      })
    );
  }
  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <StatusBar barStyle="dark-content" />
        <Header title="Discover" main />
        <LocationProvider
          updateUser={true}
          render={({ position, error, loading }) => {
            if (error) {
              return (
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>Location not found</Text>
                </View>
              );
            } else if (loading) {
              return <Spinner />;
            } else if (position) {
              return <Cards navigation={navigation} location={position} />;
            }
            return null;
          }}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  errorView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100
  },
  errorText: {
    fontSize: Platform.OS === "ios" ? 20 : 18,
    color: "#aaa",
    textAlign: "center"
  }
});
