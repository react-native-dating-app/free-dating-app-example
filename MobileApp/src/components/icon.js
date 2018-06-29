// stable
import React from "react";
import { Icon, getTheme, StyleProvider } from "native-base";
import PropTypes from "prop-types";

const MIcon = ({ family, name, style }) => {
  const icon = <Icon name={name} style={style} />;
  if (family) {
    const customTheme = getTheme({ iconFamily: family });
    return <StyleProvider style={customTheme}>{icon}</StyleProvider>;
  } else {
    return icon;
  }
};

MIcon.defaultProps = {
  family: "Ionicons",
  style: {}
};
MIcon.propTypes = {
  family: PropTypes.string,
  style: PropTypes.any,
  name: PropTypes.string.isRequired
};

export default MIcon;
