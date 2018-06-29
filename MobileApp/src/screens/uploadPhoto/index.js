// stable
import React from "react";
import _ from "lodash";
import ImagePicker from "react-native-image-picker";
import { Content, List, Toast } from "native-base";
import Header from "../../components/header";
import Source from "./source";

const camera = require("../../../assets/camera.png");
const gallery = require("../../../assets/gallery.png");

export default class UploadPhoto extends React.Component {
  state = {
    fbPhotosCount: 110,
    image: null
  }
  pickImage = () => {
    const options = {
      allowsEditing: true,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
      const { handleUpload } = _.get(this, "props.navigation.state.params");
      if (response.error) {
        Toast.show({
          text: "Error in Launching Image Gallery",
          position: "bottom",
          type: "danger",
          duration: 1000
        });
      }
      if (!response.didCancel) {
        if (handleUpload) {
          handleUpload(response);
          this.props.navigation.goBack();
        }
      }
    });
  }

  openCamera = () => {
    const { handleUpload } = _.get(this, "props.navigation.state.params");
    const options = {
      allowsEditing: true,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.launchCamera(options, response => {
      if (response.error) {
        Toast.show({
          text: "Error in Lauching Camera",
          position: "bottom",
          type: "danger",
          duration: 1000
        });
      }
      // Add Api call to update profile image
      if (!response.didCancel) {
        if (handleUpload) {
          handleUpload(response);
          this.props.navigation.goBack();
        }
      }
    });
  }

  render() {
    return (
      <Content style={{ backgroundColor: "#fdfdfd" }}>
        <Header
          backButton
          title="Upload Photo"
          onPressBack={() => this.props.navigation.goBack()}
        />
        <List>
          <Source
            onPress={this.pickImage}
            name={"Gallery"}
            iconName={gallery}
          />

          <Source
            onPress={this.openCamera}
            name={"Open Camera"}
            iconName={camera}
          />
        </List>
      </Content>
    );
  }
}
