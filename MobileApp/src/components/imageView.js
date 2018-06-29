// stable
import React, { Component } from "react";
import _ from "lodash";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import { Item, Text } from "native-base";
import commonColor from "../theme/variables/commonColor";
import UplaodImage from "./../containers/uploadImage";
import MIcon from "./icon";
const dwidth = Dimensions.get("window").width;
const dheight = Dimensions.get("window").height;

class ImageView extends Component {
  state = {
    loading: false,
    error: false
  }
  onLoadStart = () => {
    this.setState({
      loading: true
    });
  }
  onLoadEnd = () => {
    this.setState({
      loading: false
    });
  }
  onError = () => {
    this.setState({
      loading: false,
      error: true
    });
  }
  render() {
    const {
      image,
      onRemoveImage,
      containerStyle,
      iconStyle,
      imageStyle,
      itemStyle,
      userId,
      navigation,
      onUploadStart,
      onUploadEnd,
      onUploadSuccess,
      onUploadError,
      onPressImage,
      selectedImages,
      index,
      totalImages
    } = this.props;
    const { loading, error } = this.state;

    if (!(image && image.url) || totalImages === 1) {
      return (
        <UplaodImage
          index={index}
          containerStyle={containerStyle}
          iconStyle={iconStyle}
          imageStyle={imageStyle}
          itemStyle={itemStyle}
          userId={userId}
          profilePicture={image && image.url}
          navigation={navigation}
          onUploadStart={onUploadStart}
          onUploadEnd={onUploadEnd}
          onUploadSuccess={onUploadSuccess}
          onUploadError={onUploadError}
        />
      );
    }
    const isSelected = _.some(
      selectedImages,
      imageData => imageData.id === image.id
    );

    return (
      <View style={[styles.containerView, containerStyle]}>
        {error && <Text>Unable to fetch image</Text>}
        <Item style={styles.noItemView}>
          <Text style={styles.noItemViewText}>{index}</Text>
        </Item>
        <TouchableWithoutFeedback onPress={() => onPressImage(image)}>
          <View>
            <Image
              source={{
                uri: image.url
              }}
              onLoadStart={this.onLoadStart}
              onError={this.onError}
              onLoadEnd={this.onLoadEnd}
              style={[styles.imageView, imageStyle]}
            />
          </View>
        </TouchableWithoutFeedback>
        {isSelected && (
          <View
            pointerEvents="none"
            style={[
              imageStyle,
              {
                position: "absolute",
                backgroundColor: "rgba(172, 200, 120, 0.5)",
                borderColor: "blue",
                borderWidth: 2
              }
            ]}
          />
        )}
        <Item
          style={[styles.itemView, itemStyle]}
          disabled={isSelected}
          onPress={() => onRemoveImage(image)}
        >
          <MIcon
            family="FontAwesome"
            name="times"
            style={[styles.icon, iconStyle]}
          />
        </Item>
      </View>
    );
  }
}

ImageView.defaultProps = {
  imageStyle: {},
  iconStyle: {},
  itemStyle: {},
  containerStyle: {}
};

const styles = StyleSheet.create({
  containerView: {
    marginRight: 24
    // marginTop: 10
  },
  imageView: {
    width: 143,
    height: 190
  },
  itemView: {
    borderBottomWidth: 0,
    backgroundColor: commonColor.brandPrimary,
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: "40%",
    marginTop: -14,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    paddingRight: 0,
    color: "#fff",
    fontSize: 14
  },
  noItemView: {
    borderBottomWidth: 0,
    backgroundColor: "#fff",
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: 5,
    right: 5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  noItemViewText: {
    color: commonColor.brandPrimary,
    fontSize: 16,
    fontWeight: "bold"
  }
});
export default ImageView;
