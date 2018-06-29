// stable
import React from "react";
import { View, Text, Image, Platform, Dimensions } from "react-native";
import styles from "./styles";
import PropTypes from "prop-types";
const dheight = Dimensions.get("window").height;

const Card = props => {
  const {
    profilePicture,
    name,
    averageAge,
    active,
    jobTitle,
    worksAt,
    index,
    activeIndex
  } = props;
  const count = index - activeIndex - 1;
  const height =
    (Platform.OS === "ios" ? dheight / 2.2 : dheight / 2.6) - count * 30;
  return (
    <View
      style={[
        styles.card,
        {
          height: height + 100
        }
      ]}
    >
      <View style={{ height: height }}>
        <Image style={styles.image} source={{ uri: profilePicture }} />
      </View>
      {active && (
        <View style={styles.descView}>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={styles.nameage}>
              {name}, {averageAge}
            </Text>
            <Text style={styles.personalinfo}>
              {jobTitle || "Active Dating App User"}
            </Text>

            <Text style={styles.workinfo}>{worksAt || "Dating Corp. ltd"}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

Card.defaultProps = {
  profilePicture: "",
  jobTitle: "",
  worksAt: ""
};

Card.propTypes = {
  profilePicture: PropTypes.string,
  name: PropTypes.string,
  averageAge: PropTypes.number,
  active: PropTypes.bool,
  jobTitle: PropTypes.string,
  worksAt: PropTypes.string
};

export default Card;
