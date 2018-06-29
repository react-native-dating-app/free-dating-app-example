// stable
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import PropTypes from "prop-types";
import commonColor from "../../theme/variables/commonColor";

const gradientConfig = {
  horizontal: {
    start: { x: 0.0, y: 0.0 },
    end: { x: 1.0, y: 0.0 },
    locations: [0.1, 0.75, 1]
  },
  diagonal: {
    start: { x: 0.0, y: 0.25 },
    end: { x: 0.5, y: 1.0 },
    locations: [0.1, 0.75, 1]
  },
  vertical: {
    start: { x: 1.0, y: 0.0 },
    end: { x: 1.0, y: 1.0 },
    locations: [0.1, 0.75, 1]
  }
};

const colors = [
  commonColor.gradientOne,
  commonColor.gradientTwo,
  commonColor.gradientThird
];

const GradientView = props => {
  const { children, type } = props;
  return (
    <LinearGradient {...gradientConfig[type]} colors={colors} {...props}>
      {children}
    </LinearGradient>
  );
};
GradientView.defaultProps = {
  type: "vertical"
};
GradientView.propTypes = {
  type: PropTypes.oneOf(["vertical", "diagonal", "horizontal"])
};

export default GradientView;
