// stable
import React from "react";
import styles from "./styles";
import { View, Text, Item, Input } from "native-base";
import PropTypes from "prop-types";

const TextInput = ({
  control: { value, handler, hasError, touched },
  meta: { label, multiline, placeholder = "" }
}) => (
  <View style={styles.heading}>
    <Text style={styles.headingText}>{label}</Text>
    <Item regular style={styles.inputView}>
      <Input
        style={multiline ? styles.aboutStyle : styles.inputStyle}
        placeholder={placeholder}
        placeholderTextColor="#5C6B7A"
        {...handler()}
        multiline={multiline}
      />
    </Item>
    <Text style={{ color: "red" }}>
      {hasError("minLength") && "minimum length should be 30 words"}
    </Text>
  </View>
);

TextInput.propTypes = {
  control: PropTypes.shape({
    value: PropTypes.any,
    handler: PropTypes.func,
    hasError: PropTypes.func,
    touched: PropTypes.bool
  }),
  meta: PropTypes.shape({
    label: PropTypes.string,
    multiline: PropTypes.bool,
    placeholder: PropTypes.string
  })
};

export default TextInput;
