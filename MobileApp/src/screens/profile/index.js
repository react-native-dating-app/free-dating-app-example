// stable
"use strict";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { Toast, Icon } from "native-base";
import {
  FieldGroup,
  FieldControl,
  FormBuilder,
  Validators
} from "react-reactive-form";
import {
  Container,
  Content,
  Button,
  Card,
  CardItem,
  Switch
} from "native-base";
import { graphql, compose } from "react-apollo";
import _ from "lodash";
import CommonColor from "../../theme/variables/commonColor";
import RenderTag from "../../components/renderTag";
import RenderImage from "../../components/renderImage";
import { UPDATE_USER_MUTATION } from "../../graphql/mutation";
import { DELETE_FILE_MUTATION, CREATE_FILE_MUTATION } from "./graphql";
import { GET_USER_QUERY } from "../../graphql/query";
import Loader from "../../components/loader";
import styles from "./styles";
import Header from "../../components/header";
import InterestSearch from "../../containers/interestSearch";
import { getOrderedPictures } from "./../../utils";
import ErrorHandler from "../../components/errorHandler";
import TextInput from "./textInput";

class EditProfile extends Component {
  profileForm = FormBuilder.group({
    pictures: [[]],
    interests: [[]],
    jobTitle: [""],
    description: ["", Validators.minLength(150)],
    worksAt: [""],
    instagram: false,
    gender: "Male",
    profilePicture: ""
  })
  state = {
    updateLoading: false,
    canSwapImage: false
  }
  selectedImages = []

  componentWillReceiveProps(nextProps) {
    const userData = _.get(nextProps, "data.user");

    if (userData) {
      let pictures = getOrderedPictures(
        userData.pictures,
        userData.picturePreferences,
        userData.profilePicture
      );
      this.profileForm.patchValue(Object.assign({}, userData, { pictures }));
    }
  }
  componentWillMount() {
    const instaCtrl = this.profileForm.get("instagram");
    instaCtrl.onValueChanges.subscribe(value => {
      if (value) {
        // If value is true then navigate to instagram login
        const { data } = this.props;
        this.props.navigation.navigate({
          routeName: "SocialLogin",
          key: "SocialLogin",
          params: {
            name: "instagram",
            userId: _.get(data, "user.id"),
            onError: () => {
              instaCtrl.setValue(false);
            }
          }
        });
      }
    });
    this.profileForm.get("pictures").valueChanges.subscribe(value => {
      if (value && value.length) {
        const profilePicCtrl = this.profileForm.get("profilePicture");
        profilePicCtrl.setValue(value[0].url);
      }
    });
  }

  componentWillUnmount() {
    this.profileForm.get("instagram").onValueChanges.unsubscribe();
    this.profileForm.get("pictures").valueChanges.unsubscribe();
  }
  onSwapReady = selectedImages => {
    this.selectedImages = selectedImages;
    this.setState({
      canSwapImage: true
    });
  }
  onSwapCancel = () => {
    this.setState({
      canSwapImage: false
    });
  }
  updateUser = (
    payload,
    successCallback = () => {},
    errorCallback = () => {}
  ) => {
    const { mutate, data } = this.props;
    const userId = _.get(data, "user.id");
    if (userId) {
      this.setState(
        {
          updateLoading: true
        },
        () =>
          mutate({
            variables: { ...payload, id: userId }
          })
            .then(res => {
              data.refetch().then(() => {
                this.setState(
                  {
                    updateLoading: false
                  },
                  () => {
                    successCallback(res);
                  }
                );
              });
            })
            .catch(err => {
              this.setState(
                {
                  updateLoading: false
                },
                () => {
                  errorCallback(err);
                }
              );
            })
      );
    }
  }

  getPayload = () => {
    const mapInterestsToIds = this.profileForm.value.interests.map(
      item => item.id
    );
    const mapPicturesToIds = _.filter(
      this.profileForm.value.pictures,
      o => o.id !== "1"
    ).map(item => item.id);
    const payload = {
      ...this.profileForm.value,
      interestsIds: mapInterestsToIds,
      picturesIds: mapPicturesToIds,
      picturePreferences: mapPicturesToIds
    };
    return payload;
  }
  goBack = () => {
    const { navigation } = this.props;
    const payload = this.getPayload();
    if (this.profileForm.dirty) {
      this.updateUser(
        payload,
        () => navigation.goBack(),
        () => this.showToast("Not able to update profile", "warning")
      );
    } else {
      navigation.goBack();
    }
  }

  swapImages = async () => {
    const picturesCtrl = this.profileForm.get("pictures");
    const pictures = picturesCtrl.value;
    let newPictures = _.cloneDeep(pictures);
    let index1;
    let index2;
    pictures.every((image, index) => {
      const isExist = _.find(this.selectedImages, pic => pic.id === image.id);
      if (index1 === undefined && isExist) {
        index1 = index;
        return true;
      } else if (isExist) {
        index2 = index;
        return false;
      }
      return true;
    });
    // Swap images
    newPictures[index1] = newPictures.splice(index2, 1, newPictures[index1])[0];
    // Set pictures
    picturesCtrl.setValue(newPictures);
    // Update user data
    const payload = this.getPayload();
    this.updateUser(
      payload,
      () => this.showToast("Update images"),
      () => this.showToast("Unable to update profile", "warning")
    );
  }
  showToast = (message, type = "success") => {
    Toast.show({
      text: message,
      position: "bottom",
      type: type,
      duration: 1000
    });
  }
  onRemoveImage = async imageData => {
    const { deleteFile } = this.props;
    try {
      this.setState({
        updateLoading: true
      });
      await deleteFile({
        variables: {
          id: imageData.id
        }
      });
      const ctrl = this.profileForm.get("pictures");
      ctrl.setValue(_.filter(ctrl.value, o => o.id !== imageData.id));
      this.updateUser(
        this.getPayload(),
        () => this.showToast("Removed image"),
        () => this.showToast("Unable to remove image", "warning")
      );
    } catch (e) {
      this.setState({
        updateLoading: false
      });
    }
  }
  onUploadImage = async imageData => {
    const { createFile, data } = this.props;
    const userId = _.get(data, "user.id");
    const pictureCtrl = this.profileForm.get("pictures");
    const profilePicCtrl = this.profileForm.get("profilePicture");

    const isUploadingProfilePic =
      pictureCtrl.value.length < 2 && imageData.index === 1;

    const image = {
      id: imageData.id,
      url: imageData.url
    };
    //Check if the profile picture is not present in the pictures
    if (
      !isUploadingProfilePic &&
      _.some(pictureCtrl.value, o => o.id === "1")
    ) {
      try {
        this.setState({
          updateLoading: true
        });
        const res = await createFile({
          variables: {
            contentType: "image/jpeg",
            name: "ProfileImage",
            secret: userId,
            size: 3343,
            url: profilePicCtrl.value
          }
        });
        const imageId = _.get(res, "data.createFile.id");
        const imageUrl = _.get(res, "data.createFile.url");
        const newPictures = _.filter(pictureCtrl.value, o => o.id !== "1");
        newPictures.unshift({
          id: imageId,
          url: imageUrl
        });
        newPictures.push(image);
        this.setPictures(newPictures);
      } catch (e) {
        this.setState({
          updateLoading: false
        });
      }
    } else {
      if (isUploadingProfilePic) {
        this.setPictures([image]);
      } else {
        this.setPictures(pictureCtrl.value.concat([image]));
      }
    }
  }
  setPictures = (pictures = []) => {
    const pictureCtrl = this.profileForm.get("pictures");
    pictureCtrl.setValue(pictures);
    this.updateUser(this.getPayload());
  }
  render() {
    const { data: { loading, error }, navigation } = this.props;
    const userId = _.get(this.props, "data.user.id");
    const userName = _.get(this.props, "data.user.name");
    if (error) {
      return (
        <Container style={{ flex: 1 }}>
          <Header
            backButton
            title="Edit Profile"
            onPressBack={() => this.goBack()}
          />
          <Content>
            <ErrorHandler error={error} />;
          </Content>
        </Container>
      );
    }
    return (
      <Container style={styles.container}>
        <Header
          backButton
          title="Edit Profile"
          onPressBack={() => {
            this.profileForm.valid
              ? this.goBack()
              : this.scrollView._root.scrollToPosition(0, 400);
          }}
        />
        <Content ref={c => (this.scrollView = c)} style={styles.container}>
          <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
            <View style={styles.photosheading}>
              <Text style={styles.headingText}>Photos</Text>
              {this.state.canSwapImage && (
                <Button onPress={this.swapImages} style={styles.swapbutton}>
                  <Icon name="md-swap" style={{ color: "#5c6b7a" }} />
                </Button>
              )}
            </View>
            {
              <FieldGroup
                control={this.profileForm}
                render={({ get, value }) => (
                  <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
                    <FieldControl
                      name="pictures"
                      render={({ value, handler }) => (
                        <RenderImage
                          userId={userId}
                          navigation={navigation}
                          images={value}
                          onSwapCancel={this.onSwapCancel}
                          onSwapReady={this.onSwapReady}
                          onRemoveImage={this.onRemoveImage}
                          onUploadStart={() =>
                            this.setState({
                              updateLoading: true
                            })
                          }
                          onUploadEnd={() =>
                            this.setState({
                              updateLoading: false
                            })
                          }
                          onUploadSuccess={this.onUploadImage}
                          onUploadError={() =>
                            this.showToast("Unable to upload image", "warning")
                          }
                        />
                      )}
                    />

                    <FieldControl
                      name="interests"
                      render={({ value, onChange }) => (
                        <View style={styles.heading}>
                          {value && value.length ? (
                            <View style={{ marginTop: 10 }}>
                              <Text style={styles.headingText}>
                                Selected Interests
                              </Text>
                              <RenderTag
                                onSelectTag={tag =>
                                  onChange(
                                    _.filter(value, o => o.id !== tag.id)
                                  )
                                }
                                tags={value}
                                remove={true}
                              />
                            </View>
                          ) : null}
                          <View style={styles.InterestsView}>
                            <Text style={styles.headingText}>Interests</Text>
                            <Button
                              style={styles.interestAddBtn}
                              onPress={() => {
                                this.modal.open();
                              }}
                            >
                              <Text style={styles.addText}>Add</Text>
                            </Button>
                          </View>
                        </View>
                      )}
                    />
                    <FieldControl
                      name="description"
                      render={control => (
                        <TextInput
                          meta={{
                            label: `About ${userName}`,
                            placeholder: "About You",
                            multiline: true
                          }}
                          control={control}
                        />
                      )}
                    />
                    <FieldControl
                      name="jobTitle"
                      render={control => (
                        <TextInput
                          meta={{
                            label: "Current Work",
                            placeholder: "Select work"
                          }}
                          control={control}
                        />
                      )}
                    />
                    <FieldControl
                      name="worksAt"
                      render={control => (
                        <TextInput
                          meta={{
                            label: "School",
                            placeholder: "Select school"
                          }}
                          control={control}
                        />
                      )}
                    />
                    <View style={styles.heading}>
                      <Text style={styles.headingText}>
                        Social Media Account
                      </Text>
                      <Card style={styles.card}>
                        <FieldControl
                          name="instagram"
                          render={({ handler }) => (
                            <CardItem style={styles.switchStyle}>
                              <Text style={styles.switchText}>Instagram</Text>
                              <Switch
                                {...handler("switch")}
                                style={styles.switch1}
                                onTintColor={CommonColor.brandPrimary}
                              />
                            </CardItem>
                          )}
                        />
                      </Card>
                      <FieldControl
                        name="gender"
                        render={({ value }) => (
                          <View style={styles.heading}>
                            <Text style={styles.headingText}>Gender</Text>
                            <View style={{ marginVertical: 10 }}>
                              <View style={styles.buttonViewStyle}>
                                <View
                                  style={{
                                    flex: 1,
                                    paddingRight: 15,
                                    borderColor: CommonColor.brandPrimary
                                  }}
                                >
                                  <Button
                                    block
                                    disabled
                                    style={{
                                      ...styles.genderButton,
                                      borderColor: CommonColor.brandPrimary,
                                      backgroundColor:
                                        value === "Male"
                                          ? CommonColor.brandPrimary
                                          : "transparent"
                                    }}
                                    onPress={() => this.changeDisType(1)}
                                  >
                                    <Text
                                      style={{
                                        ...styles.buttonText,
                                        color:
                                          value === "Male"
                                            ? "#FFF"
                                            : CommonColor.brandPrimary
                                      }}
                                    >
                                      Male
                                    </Text>
                                  </Button>
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    paddingLeft: 15,
                                    borderColor: CommonColor.brandPrimary
                                  }}
                                >
                                  <Button
                                    disabled
                                    block
                                    style={{
                                      ...styles.genderButton,
                                      borderColor: CommonColor.brandSecondary,
                                      backgroundColor:
                                        value !== "Male"
                                          ? CommonColor.brandSecondary
                                          : "transparent"
                                    }}
                                    onPress={() => this.changeDisType(2)}
                                  >
                                    <Text
                                      style={{
                                        ...styles.buttonText,
                                        color:
                                          value !== "Male"
                                            ? "#FFF"
                                            : CommonColor.brandSecondary
                                      }}
                                    >
                                      Female
                                    </Text>
                                  </Button>
                                </View>
                              </View>
                            </View>
                          </View>
                        )}
                      />
                      <FieldControl
                        name="interests"
                        render={({ value, onChange }) => (
                          <InterestSearch
                            selectedTags={value}
                            onChange={onChange}
                            getReference={c => {
                              this.modal = c;
                            }}
                          />
                        )}
                      />
                    </View>
                  </View>
                )}
              />
            }
          </View>
        </Content>
        <Loader loading={loading || this.state.updateLoading} />
      </Container>
    );
  }
}

const GQLUserProfileProvider = compose(
  graphql(
    GET_USER_QUERY(`
      id
      name
      profilePicture
      pictures {
        id
        url
      }
      interests {
        id
        name
      }
      jobTitle
      description
      worksAt
      instagram
      spotify
      gender
      profilePicture
      picturePreferences
    `)
  ),
  graphql(
    UPDATE_USER_MUTATION(`
      id
    `)
  ),
  graphql(DELETE_FILE_MUTATION, { name: "deleteFile" }),
  graphql(CREATE_FILE_MUTATION, { name: "createFile" })
)(EditProfile);

export default GQLUserProfileProvider;
