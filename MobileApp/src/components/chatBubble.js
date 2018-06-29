// stable
import React from "react";
import { View, StyleSheet } from "react-native";

const ChatBubble = ({ style }) => <View style={[styles.chatBubble, style]} />;

ChatBubble.defaultProps = {
  style: {}
};

const styles = StyleSheet.create({
  chatBubble: {
    backgroundColor: "red",
    position: "absolute",
    width: 12,
    top: 10,
    right: 40,
    height: 12,
    borderRadius: 6
  }
});

export default ChatBubble;
