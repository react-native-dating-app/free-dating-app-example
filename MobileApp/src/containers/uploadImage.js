//stable
import React, { Component } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { View, Image, StyleSheet } from "react-native";
import { Item, Text } from "native-base";
import commonColor from "../theme/variables/commonColor";
import ConfigLocal from "../../config-local";
import MIcon from "../components/icon";

class UploadImage extends Component {
  uploadFile = file => {
    const {
      onUploadStart,
      onUploadError,
      onUploadSuccess,
      onUploadEnd,
      index
    } = this.props;
    onUploadStart();
    let data = new FormData();
    data.append("data", file);

    // use the file endpoint
    fetch(ConfigLocal.FILE_HOST, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(fileData => {
        const fileId = fileData.id;
        const url = fileData.url;
        onUploadSuccess({
          id: fileId,
          url,
          index
        });
      })
      .catch(err => {
        onUploadEnd();
        onUploadError(err);
      });
  }

  onPressAdd = data => {
    const { onUploadError, onUploadEnd } = this.props;
    if (data.uri) {
      const imageName = data.uri.split("/")[data.uri.split("/").length - 1];
      const imageNameWithExt =
        imageName.split(".").length > 1 ? imageName : `${imageName}.jpg`;
      const payload = {
        uri: data.uri,
        name: imageNameWithExt,
        type: "image/jpeg"
      };
      this.uploadFile(payload);
    } else {
      onUploadEnd();
      onUploadError();
    }
  }
  handleAddImage = index => {
    const { navigation } = this.props;
    navigation.navigate({
      routeName: "UploadPhoto",
      key: "UploadPhoto",
      params: {
        handleUpload: this.onPressAdd
      }
    });
  }
  render() {
    const {
      containerStyle,
      iconStyle,
      imageStyle,
      itemStyle,
      profilePicture,
      index
    } = this.props;
    return (
      <View style={[styles.containerView, containerStyle]}>
        {profilePicture ? (
          <View style={{ flex: 1 }}>
            <Item style={styles.noItemView}>
              <Text style={styles.noItemViewText}>1</Text>
            </Item>
            <Image
              style={[styles.imageView, imageStyle]}
              source={{ uri: profilePicture }}
            />
            <Item style={styles.itemView} onPress={this.handleAddImage}>
              <MIcon
                family="FontAwesome"
                name={profilePicture ? "times" : "plus"}
                style={[styles.icon, iconStyle]}
              />
            </Item>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Item style={styles.noItemView}>
              <Text style={styles.noItemViewText}>{index}</Text>
            </Item>
            <View style={[styles.imageView1, imageStyle]} />
            <Item
              style={[styles.itemView, itemStyle]}
              onPress={this.handleAddImage}
            >
              <MIcon
                family="FontAwesome"
                name={profilePicture ? "times" : "plus"}
                style={[styles.icon, iconStyle]}
              />
            </Item>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    width: 143,
    height: 220,
    marginRight: 24
  },
  imageView: {
    width: 143,
    height: 190
  },
  imageView1: {
    width: 143,
    height: 190,
    backgroundColor: "#c6c6c6"
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
  },
  icon: {
    paddingRight: 0,
    color: "#fff",
    fontSize: 14
  }
});

UploadImage.propTypes = {
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
  onUploadStart: PropTypes.func,
  onUploadEnd: PropTypes.func,
  navigation: PropTypes.object.isRequired,
  userId: PropTypes.string
};
UploadImage.defaultProps = {
  onUploadError: () => {},
  onUploadSuccess: () => {},
  onUploadStart: () => {},
  onUploadEnd: () => {}
};

const ADD_USER_PICTURE_MUTATION = gql`
  mutation addToUserPictures($pictureId: ID!, $userId: ID!) {
    addToUserPictures(picturesFileId: $pictureId, userUserId: $userId) {
      picturesFile {
        id
        url
      }
    }
  }
`;

export default graphql(ADD_USER_PICTURE_MUTATION)(UploadImage);
