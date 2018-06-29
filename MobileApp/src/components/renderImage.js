// stable
import React, { Component } from "react";
import { Dimensions, Platform } from "react-native";
import PropTypes from "prop-types";
import ImageView from "./imageView";
import { View } from "native-base";
const dwidth = Dimensions.get("window").width;
const dheight = Dimensions.get("window").height;
const aspectRatio = dheight / dwidth;
const Iwidth = dwidth / 2;
const Iheight = dheight / 2.3;

class RenderImage extends Component {
  state = {
    selectedImages: []
  }
  onPressImage = imageData => {
    const { onSwapReady, onSwapCancel } = this.props;
    if (imageData) {
      let selectedImages = this.state.selectedImages;
      let isExist = false;
      let isModified = false;
      this.state.selectedImages.every((image, index) => {
        if (image.id === imageData.id) {
          selectedImages.splice(index, 1);
          isModified = true;
          isExist = true;
          return false;
        }
        return true;
      });

      if (!isExist && this.state.selectedImages.length < 2) {
        selectedImages.push(imageData);
        isModified = true;
      }

      this.setState(
        {
          selectedImages
        },
        () => {
          if (isModified) {
            if (this.state.selectedImages.length === 2) {
              onSwapReady(this.state.selectedImages);
            } else {
              onSwapCancel();
            }
          }
        }
      );
    }
  }
  render() {
    const {
      images,
      onRemoveImage,
      userId,
      navigation,
      onUploadStart,
      onUploadEnd,
      onUploadSuccess,
      onUploadError
    } = this.props;
    const commonProps = {
      userId,
      navigation,
      onRemoveImage,
      onUploadStart,
      onUploadEnd,
      onUploadSuccess,
      onUploadError,
      onPressImage: this.onPressImage,
      selectedImages: this.state.selectedImages,
      totalImages: images.length
    };
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <ImageView
            containerStyle={{
              width:
                Platform.OS === "ios"
                  ? aspectRatio > 1.6 ? 200 : Iwidth
                  : 200, // 200
              height:
                Platform.OS === "ios"
                  ? aspectRatio > 1.6 ? 300 : Iheight
                  : 300
            }}
            imageStyle={{
              width:
                Platform.OS === "ios"
                  ? aspectRatio > 1.6 ? 200 : Iwidth
                  : 200,
              height:
                Platform.OS === "ios"
                  ? aspectRatio > 1.6 ? 260 : Iheight - 20
                  : 260
            }}
            index={1}
            image={images[0]}
            {...commonProps}
          />
          <View style={{ flexDirection: "column" }}>
            {Array.apply(null, Array(2)).map((item, index) => (
              <ImageView
                key={index}
                index={index + 2}
                containerStyle={{
                  width:
                    Platform.OS === "ios"
                      ? aspectRatio > 1.6 ? 90 : Iwidth / 2 - 10
                      : 90,
                  height:
                    Platform.OS === "ios"
                      ? aspectRatio > 1.6 ? 140 : Iheight / 2 + 12
                      : 140
                }}
                imageStyle={{
                  width:
                    Platform.OS === "ios"
                      ? aspectRatio > 1.6 ? 90 : Iwidth / 2 - 10
                      : 90,
                  height:
                    Platform.OS === "ios"
                      ? aspectRatio > 1.6 ? 120 : Iheight / 2 - 40
                      : 120
                }}
                image={images[index + 1]}
                {...commonProps}
              />
            ))}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: Platform.OS === "ios" && aspectRatio < 1.6 ? 15 : null
          }}
        >
          {Array.apply(null, Array(3)).map((item, index) => (
            <ImageView
              key={index}
              index={6 - index}
              containerStyle={{
                width:
                  Platform.OS === "ios"
                    ? aspectRatio > 1.6 ? 90 : Iwidth / 2 - 10
                    : 90,
                height:
                  Platform.OS === "ios"
                    ? aspectRatio > 1.6 ? 140 : Iheight / 2 - 10
                    : 140
              }}
              imageStyle={{
                width:
                  Platform.OS === "ios"
                    ? aspectRatio > 1.6 ? 90 : Iwidth / 2 - 10
                    : 90,
                height:
                  Platform.OS === "ios"
                    ? aspectRatio > 1.6 ? 120 : Iheight / 2 - 10
                    : 120
              }}
              image={images[5 - index]}
              {...commonProps}
            />
          ))}
        </View>
      </View>
    );
  }
}

RenderImage.defaultProps = {
  onSwapReady: () => {},
  onSwapCancel: () => {}
};

RenderImage.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      id: PropTypes.string
    })
  ),
  onUploadStart: PropTypes.func,
  onUploadEnd: PropTypes.func,
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
  onRemoveImage: PropTypes.func,
  userId: PropTypes.string
};

export default RenderImage;
