// stable
import React from "react";
import { View, Text } from "native-base";
import { StyleSheet } from "react-native";
import _ from "lodash";
import PropTypes from "prop-types";

const ErrorMessages = {
  networkError: "No Internet Connection",
  default: "Something went wrong"
};

const ErrorHandler = ({ error }) => {
  let errorMsg = ErrorMessages.default;

  if (_.get(error, "networkError")) {
    errorMsg = ErrorMessages.networkError;
  }
  return (
    <View style={styles.errorView}>
      <Text style={{ color: "white" }}>{errorMsg}</Text>
    </View>
  );
}

ErrorHandler.propTypes = {
  error: PropTypes.object
};

const styles = StyleSheet.create({
  errorView: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default ErrorHandler;
