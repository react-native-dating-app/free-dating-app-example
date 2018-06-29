// stable
import React from "react";
import { StyleSheet, Platform, Image, TouchableOpacity } from "react-native";
import { Header, Left, Button, Text, Right } from "native-base";
import PropTypes from "prop-types";
import { Fonts } from "../variables";

const ArrowBack = require("../../assets/back-arrow.png");

const PageHeader = ({
  main,
  backButton,
  title,
  onPressBack,
  onPressHeader,
  right
}) => (
  <Header style={styles.header}>
    <Left style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      {backButton && (
        <Button onPress={() => onPressBack()} transparent>
          <Image source={ArrowBack} style={styles.arrowBack} />
        </Button>
      )}
      {onPressHeader ? (
        <TouchableOpacity onPress={() => onPressHeader()}>
          <Text style={main ? styles.headerTextMain : styles.headerText}>
            {title}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={main ? styles.headerTextMain : styles.headerText}>
          {title}
        </Text>
      )}
    </Left>
    {right && <Right style={{ flex: 0.3 }}>{right}</Right>}
  </Header>
);

PageHeader.defaultProps = {
  onPressHeader: () => null,
  onPressBack: () => null
};

PageHeader.propTypes = {
  backButton: PropTypes.bool
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    marginLeft: Platform.OS === "ios" ? null : -15
  },
  headerTextMain: {
    fontSize: Platform.OS === "ios" ? 32 : 28,
    color: "#5C6B7A",
    paddingLeft: 20,
    fontFamily: Fonts.PoppinsRegular
  },
  headerText: {
    fontSize: Platform.OS === "ios" ? 22 : 20,
    color: "#5C6B7A",
    paddingLeft: 20,
    fontFamily: Fonts.PoppinsRegular
  },
  arrowBack: {
    width: 25,
    height: 25,
    marginLeft: Platform.OS === "ios" ? null : 10
  }
});

export default PageHeader;
