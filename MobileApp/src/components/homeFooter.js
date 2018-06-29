//stable
import React, { Component } from "react";
import OneSignal from "react-native-onesignal";
import { Footer, FooterTab, Button } from "native-base";
import { StyleSheet, Image, StatusBar } from "react-native";
import _ from "lodash";
import ChatBubble from "./../components/chatBubble";

const Home = require("../../assets/Home.png");
const Home1 = require("../../assets/home2.png");
const Chat = require("../../assets/chat.png");
const Chat1 = require("../../assets/chat2.png");
const Acc = require("../../assets/account.png");
const Acc1 = require("../../assets/account2.png");

export default class HomeFooter extends Component {
  static navigationOptions = {
    title: "Welcome"
  }
  constructor(props) {
    super(props);
    this.state = {
      showChatBubble: false
    };
  }
  componentWillMount() {
    OneSignal.addEventListener("received", this.onReceived);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
  }
  onReceived = notification => {
    if (
      _.get(this, "props.footerProps.navigationState.index") !== 1 &&
      _.get(notification, "payload.additionalData.source") === "chat"
    ) {
      this.setState({
        showChatBubble: true
      });
    }
  }
  navigateToChat = () => {
    this.setState(
      {
        showChatBubble: false
      },
      () => {
        this.props.footerProps.navigation.navigate("Match");
      }
    );
  }
  navigateToHome = () => {
    this.props.footerProps.navigation.navigate("Home");
  }
  navigateToAccount = () => {
    this.props.footerProps.navigation.navigate("Account");
  }
  render() {
    return (
      <Footer style={styles.bg}>
        <StatusBar barStyle="dark-content" />
        <FooterTab style={styles.bg}>
          <Button onPress={this.navigateToHome}>
            <Image
              source={
                this.props.footerProps.navigationState.index === 0
                  ? Home
                  : Home1
              }
              style={styles.iconImage}
            />
          </Button>
          <Button onPress={this.navigateToChat}>
            <Image
              source={
                this.props.footerProps.navigationState.index === 1
                  ? Chat
                  : Chat1
              }
              style={{ width: 33, height: 33, resizeMode: "contain" }}
            />
            {this.state.showChatBubble &&
              this.props.footerProps.navigationState.index !== 1 && (
                <ChatBubble />
              )}
          </Button>
          <Button onPress={this.navigateToAccount}>
            <Image
              source={
                this.props.footerProps.navigationState.index === 2 ? Acc : Acc1
              }
              style={styles.iconImage}
            />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#fff"
  },
  iconImage: {
    width: 30,
    height: 30
  },
  chatBubble: {
    backgroundColor: "red",
    position: "absolute",
    width: 10,
    top: 10,
    right: 40,
    height: 10,
    borderRadius: 10
  }
});
