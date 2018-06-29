// stable
import React from "react";
import { StyleSheet } from "react-native";
import { Button, View, Text } from "native-base";
import PropTypes from "prop-types";
import MIcon from "../icon";

import GradientView from "./view";

const GradientBorderedButton = props => {
  const {
    onPress,
    text,
    iconName,
    gradientStyle,
    buttonStyle,
    btnTextStyle,
    iconStyle,
    textPosition
  } = props;
  let textStyle = [styles.text];
  if (textPosition === "center") {
    textStyle.push({ textAlign: "center" });
  }
  return (
    <GradientView
      style={gradientStyle ? gradientStyle : styles.borderedView}
      {...props}
    >
      <Button
        onPress={onPress}
        style={buttonStyle ? buttonStyle : styles.button}
      >
        {iconName && (
          <View style={{ flex: 3 }}>
            <MIcon
              family="FontAwesome"
              name={iconName}
              style={iconStyle ? iconStyle : styles.icon}
            />
          </View>
        )}
        {text && (
          <View style={{ flex: 7 }}>
            <Text style={btnTextStyle ? btnTextStyle : textStyle}>
              {" "}
              {text}{" "}
            </Text>
          </View>
        )}
      </Button>
    </GradientView>
  );
};
GradientBorderedButton.defaultProps = {
  type: "horizontal",
  onPress: () => {}
};
GradientBorderedButton.propTypes = {
  type: PropTypes.oneOf(["vertical", "diagonal", "horizontal"]),
  text: PropTypes.string,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  gradientStyle: PropTypes.any,
  buttonStyle: PropTypes.any,
  iconStyle: PropTypes.any
};

const styles = StyleSheet.create({
  borderedView: {
    width: 152,
    borderRadius: 20,
    padding: 1,
    elevation: 0
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 18,
    width: 150,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    elevation: 0
  },
  text: {
    color: "white",
    fontSize: 15
  },
  textView: {
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    paddingLeft: 15,
    color: "white",
    fontSize: 20
  }
});

export default GradientBorderedButton;
