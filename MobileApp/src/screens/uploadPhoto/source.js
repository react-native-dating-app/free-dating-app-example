// stable
import React from "react";
import { ListItem, Text, Body, Right, Button } from "native-base";
import { Image } from "react-native";
import styles from "./styles";
import PropTypes from "prop-types";

const ArrowForward = require("../../../assets/forward-arrow.png");

const Source = ({ onPress, iconName, name, picsCount }) => {
  return (
    <ListItem onPress={onPress}>
      <Image source={iconName} style={styles.imageIcon} />

      <Body style={{ marginLeft: 10 }}>
        <Text style={styles.listText}>{name}</Text>
        {picsCount && (
          <Text
            style={{
              color: "#5C6B7A",
              fontWeight: "500"
            }}
          >{`${picsCount} photos`}</Text>
        )}
      </Body>
      <Right>
        <Button transparent onPress={onPress}>
          <Image
            source={ArrowForward}
            style={{ ...styles.imageIcon, resizeMode: "contain" }}
          />
        </Button>
      </Right>
    </ListItem>
  );
};

Source.propTypes = {
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  name: PropTypes.string,
  picsCount: PropTypes.number
};
export default Source;
