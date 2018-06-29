// stable
import React from "react";
import { View } from "react-native";
import { Icon } from "native-base";
import PropTypes from "prop-types";

import GradientView from "./view";

const GradientBorderedButton = props => {
  return (
    <GradientView {...props}>
      <View style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}>
        <Icon style={{ color: "rgba(0, 0, 0, 1)" }} name="ios-person">
          <View
            style={{ height: 10, width: 10, backgroundColor: "transparent" }}
          />
        </Icon>
      </View>
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
  onPress: PropTypes.func
};

export default GradientBorderedButton;
