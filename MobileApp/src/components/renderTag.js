// stable
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import PropTypes from "prop-types";
import { GradientBorderedButton } from "./gradient";

const RenderTags = ({
  tags,
  selectedTags,
  contentStyle,
  onSelectTag,
  remove,
  add
}) => (
  <ScrollView horizontal scrollEnabled showsHorizontalScrollIndicator={false}>
    {tags.map(tag => (
      <View style={styles.tagButton} key={tag.id}>
        <GradientBorderedButton
          onPress={() => onSelectTag(tag)}
          text={tag.name}
          contentStyle={Object.assign({}, contentStyle, { color: "black" })}
          iconName={remove ? "minus" : add ? "plus" : null}
        />
      </View>
    ))}
  </ScrollView>
);

RenderTags.propTypes = {
  tags: PropTypes.array.isRequired,
  selectedTags: PropTypes.array,
  onSelectTag: PropTypes.func
};
RenderTags.defaultProps = {
  selectedTags: [],
  onSelectTag: () => null
};

const styles = StyleSheet.create({
  tagButton: {
    height: 50,
    padding: 10
  }
});

export default RenderTags;
