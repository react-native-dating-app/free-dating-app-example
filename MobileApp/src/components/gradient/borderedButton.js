// stable
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text, View } from "native-base";
import PropTypes from "prop-types";
import MIcon from "../icon";
import { Fonts } from "../../variables";
import commonColor from "../../theme/variables/commonColor";
import GradientView from "./view";

const GradientBorderedButton = props => {
  const { onPress, text, iconName, iconStyle } = props;
  return (
    <GradientView style={styles.borderedView} {...props}>
      <Button onPress={onPress} style={styles.button}>
        <Text style={styles.text}> {text} </Text>
        {iconName && (
          <View style={styles.IconView}>
            <MIcon
              family="FontAwesome"
              name={iconName}
              style={iconStyle ? iconStyle : styles.icon}
            />
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
  iconStyle: PropTypes.any,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  borderedView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 1,
    elevation: 0
  },
  button: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 18,
    height: 30,
    paddingRight: 5,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0,
    elevation: 0
  },
  text: {
    flex: 3,
    color: "#444",
    fontSize: 13,
    fontFamily: Fonts.Poppins
  },
  IconView: {
    flex: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: commonColor.brandSecondary,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    color: "#fff",
    fontSize: 12
  }
});

export default GradientBorderedButton;
