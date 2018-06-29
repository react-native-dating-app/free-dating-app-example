// stable
import React from "React";
import { StyleSheet, View } from "react-native";
import { Spinner, Text } from "native-base";
import PropTypes from "prop-types";

const Loader = ({ loading, loadingMsg }) => {
  if (loading) {
    return (
      <View style={styles.mainView}>
        <Spinner style={{ opacity: 1 }} color="white" />
        <Text style={styles.loadingMsgText}>{loadingMsg}</Text>
      </View>
    );
  }
  return null;
};

Loader.defaultProps = {
  loading: false,
  loadingMsg: ""
};
Loader.propTypes = {
  loading: PropTypes.bool,
  loadingMsg: PropTypes.string
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    elevation: 10,
    bottom: 0,
    right: 0,
    left: 0
  },
  loadingMsgText: {
    color: "white",
    fontSize: 15
  }
});

export default Loader;
