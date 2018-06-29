// stable
import React from "react";
import { View, Text } from "native-base";
import { Image, StyleSheet, Platform } from "react-native";
import { Fonts } from "../variables";
import PropTypes from "prop-types";

const NoMoreCards = ({ userProfilePic, message, card }) => (
  <View style={card ? styles.cardcontView : styles.containerView}>
    <View>
      <Image
        source={{
          uri: userProfilePic
        }}
        style={styles.Image}
      />
    </View>
    <Text style={styles.text}>{message}</Text>
  </View>
);

NoMoreCards.defaultProps = {
  message: "No more data",
  userProfilePic: ""
};

NoMoreCards.propTypes = {
  message: PropTypes.string,
  card: PropTypes.bool,
  userProfilePic: PropTypes.string
};

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  cardcontView: {
    marginLeft: "15%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  Image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 30
  },
  text: {
    fontSize: Platform.OS === "ios" ? 20 : 18,
    color: "#aaa",
    textAlign: "center",
    fontFamily: Fonts.PoppinsMedium
  }
});

export default NoMoreCards;
