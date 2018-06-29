import React from "react";
import { ProgressViewIOS } from "react-native";

const ProgressBarNB = props => (
  <ProgressViewIOS
    {...props}
    progress={props.progress ? props.progress / 100 : 0.5}
    progressTintColor={props.color ? props.color : "#FFF"}
    trackTintColor="rgba(255,255,255,0.5)"
  />
);
export default ProgressBarNB;
