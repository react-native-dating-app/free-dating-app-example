// stable
"use strict";
import React, { Component } from "react";
import { View, Slider, Alert, Share, Platform } from "react-native";
import { graphql, compose } from "react-apollo";
import { LoginManager } from "react-native-fbsdk";
import { NavigationActions } from "react-navigation";
import _ from "lodash";
import {
  Container,
  Content,
  Text,
  Switch,
  Button,
  Card,
  CardItem,
  ActionSheet,
  Toast
} from "native-base";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { FieldGroup, FieldControl, FormBuilder } from "react-reactive-form";
import { destroyToken } from "./../../.././configureClient";
import Header from "../../components/header";
import styles from "./styles";
import commonColor from "../../theme/variables/commonColor";
import { UPDATE_USER_MUTATION } from "../../graphql/mutation";
import { GET_USER_QUERY } from "../../graphql/query";
import Loader from "../../components/loader";
import { GradientView, GradientButton } from "../../components/gradient";
import { mileToKm } from "./../../utils";
import ErrorHandler from "../../components/errorHandler";

const iosAppStoreLink =
  "http://itunes.apple.com/lookup?bundleId=io.nativebase.market.geekyants.datingapp";
const androidAppStoreLink =
  "http://play.google.com/store/apps/details?id=io.nativebase.market.geekyants.strapdatingapp";

const deleteButtons = [
  {
    text: "Pause Account"
  },
  {
    text: "Delete"
  },
  {
    text: "Cancel"
  }
];

class Setting extends Component {
  state = {
    updateLoading: false
  }
  // Create the form schema
  discoveryForm = FormBuilder.group({
    discoverablity: true,
    showMeMale: true,
    showMeFemale: true,
    searchDistance: 100,
    distanceUnit: "Km",
    ageRange: [[18, 100]],
    notifyMatches: true,
    notifyMessages: true
  })
  componentWillReceiveProps(nextProps) {
    const userData = _.get(nextProps, "data.user");
    if (userData) {
      // Update the form values
      this.discoveryForm.patchValue(userData);
    }
  }
  componentDidMount() {
    const discoveryForm = this.discoveryForm;
    discoveryForm.get("showMeMale").valueChanges.subscribe(value => {
      const showMeFemale = discoveryForm.get("showMeFemale");
      if (!value && !showMeFemale.value) {
        showMeFemale.setValue(true);
      }
    });
    discoveryForm.get("showMeFemale").valueChanges.subscribe(value => {
      const showMeMale = discoveryForm.get("showMeMale");
      if (!value && !showMeMale.value) {
        showMeMale.setValue(true);
      }
    });
  }
  goBack = () => {
    const { navigation, data } = this.props;
    const userId = _.get(data, "user.id");
    if (this.discoveryForm.dirty && userId) {
      this.updateUser(this.discoveryForm.value, () => navigation.goBack());
    } else {
      navigation.goBack();
    }
  }

  onDeleteButtonPress = index => {
    if (index === 0) {
      // Deactivate account
      this.updateUser(
        {
          active: false
        },
        () => this.logout()
      );
    } else if (index === 1) {
      // Delete account
      Alert.alert(
        "Delete account",
        "Are you sure? This action can not be undone.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () =>
              this.updateUser(
                {
                  deleted: true
                },
                () => this.logout()
              )
          }
        ],
        { cancelable: false }
      );
    }
  }

  updateUser = (payload, successCallback = () => {}) => {
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
                    successCallback();
                  }
                );
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({
                updateLoading: false
              });
            })
      );
    }
  }

  logout = () => {
    destroyToken()
      .then(async () => {
        await LoginManager.logOut();
        this.reset();
      })
      .catch(err => {
        console.log(err);
        Toast.show({
          text: "Unable to logout",
          position: "bottom",
          type: "warning",
          duration: 1000
        });
      });
  }
  reset() {
    return this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "Onboard" })]
      })
    );
  }
  render() {
    const { data: { loading, error } } = this.props;
    if (error) {
      return (
        <Container style={{ flex: 1 }}>
          <Header
            backButton
            title="Settings"
            onPressBack={() => this.goBack()}
          />
          <Content>
            <ErrorHandler error={error} />;
          </Content>
        </Container>
      );
    }
    return (
      <Container style={{ flex: 1 }}>
        <Header backButton title="Settings" onPressBack={() => this.goBack()} />
        <Content style={styles.container}>
          {
            <FieldGroup
              control={this.discoveryForm}
              render={({ value }) => (
                <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
                  <FieldControl
                    name="discoverablity"
                    render={({ handler }) => (
                      <View>
                        <View style={styles.heading}>
                          <Text style={styles.discoveryText}>
                            Discovery Settings
                          </Text>
                        </View>
                        <Card style={styles.card}>
                          <CardItem style={styles.menSwitch}>
                            <Text style={styles.headingText}>
                              Discoverablity
                            </Text>
                            <Switch
                              {...handler("switch")}
                              style={styles.switch1}
                              onTintColor={commonColor.brandPrimary}
                            />
                          </CardItem>
                        </Card>
                      </View>
                    )}
                  />
                  <View>
                    <Card style={styles.card}>
                      <View style={styles.menSwitch}>
                        <Text style={styles.headingText}>Show Me</Text>
                      </View>
                      <CardItem style={styles.menSwitch}>
                        <Text style={styles.switchBlockHeader}>Men</Text>
                        <FieldControl
                          name="showMeMale"
                          render={({ handler }) => (
                            <Switch
                              {...handler("switch")}
                              style={styles.switch1}
                              onTintColor={commonColor.brandPrimary}
                            />
                          )}
                        />
                      </CardItem>
                      <CardItem style={styles.menSwitch}>
                        <Text style={styles.switchBlockHeader}>Women</Text>
                        <FieldControl
                          name="showMeFemale"
                          render={({ handler }) => (
                            <Switch
                              {...handler("switch")}
                              style={styles.switch1}
                              onTintColor={commonColor.brandPrimary}
                            />
                          )}
                        />
                      </CardItem>
                    </Card>
                  </View>

                  <Card style={styles.card}>
                    <CardItem style={styles.menSwitch}>
                      <Text style={styles.headingText}>Search Distance</Text>
                      <Text style={styles.searchKmText}>
                        {value.distanceUnit === "Km"
                          ? value.searchDistance
                          : mileToKm(value.searchDistance)}
                        {value.distanceUnit === "Km" ? "km." : "mi."}
                      </Text>
                    </CardItem>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <FieldControl
                        name="searchDistance"
                        render={({ onChange, value }) => (
                          <Slider
                            style={styles.slider}
                            onValueChange={onChange}
                            value={value}
                            maximumValue={100}
                            minimumTrackTintColor={commonColor.brandPrimary}
                            thumbTintColor={commonColor.brandPrimary}
                            step={1}
                          />
                        )}
                      />
                    </View>
                    <CardItem style={{ borderRadius: 5 }}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column"
                        }}
                      >
                        <FieldControl
                          name="distanceUnit"
                          render={({ handler, value }) => (
                            <View style={{ flexDirection: "row" }}>
                              <Button
                                style={{
                                  width: 96,
                                  height: 30,
                                  borderTopLeftRadius: 14,
                                  borderBottomLeftRadius: 14,
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,

                                  backgroundColor:
                                    value === "Km"
                                      ? commonColor.brandPrimary
                                      : "#C6C6C6"
                                }}
                                onPress={() => handler().onChange("Km")}
                              >
                                <Text
                                  style={{
                                    color: value === "Km" ? "#FFF" : "#FFF",
                                    fontSize: 16,
                                    fontWeight: "700"
                                  }}
                                >
                                  Km.
                                </Text>
                              </Button>
                              <Button
                                style={{
                                  width: 96,
                                  height: 30,
                                  borderTopRightRadius: 14,
                                  borderBottomRightRadius: 14,
                                  borderTopLeftRadius: 0,
                                  borderBottomLeftRadius: 0,

                                  backgroundColor:
                                    value === "Mile"
                                      ? commonColor.brandPrimary
                                      : "#C6C6C6"
                                }}
                                onPress={() => handler().onChange("Mile")}
                              >
                                <Text
                                  style={{
                                    color: value === "Mile" ? "#FFF" : "#FFF",
                                    fontSize: 16,
                                    fontWeight: "700"
                                  }}
                                >
                                  Mi.
                                </Text>
                              </Button>
                            </View>
                          )}
                        />
                      </View>
                    </CardItem>
                  </Card>

                  <FieldControl
                    name="ageRange"
                    render={({ value, handler }) => (
                      <Card style={styles.card}>
                        <CardItem style={styles.menSwitch}>
                          <Text style={styles.headingText}>Age Range</Text>
                          <Text style={styles.searchKmText}>
                            {value[0]} - {value[1]}
                          </Text>
                        </CardItem>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <MultiSlider
                            selectedStyle={{
                              backgroundColor: commonColor.brandPrimary
                            }}
                            unselectedStyle={{
                              backgroundColor: "#e7e7f0"
                            }}
                            containerStyle={{
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                            values={value}
                            onValuesChange={val => handler().onChange(val)}
                            min={18}
                            max={100}
                            step={1}
                          />
                        </View>
                      </Card>
                    )}
                  />
                  <View style={{ marginVertical: 10 }}>
                    <Text style={styles.discoveryText}>App Settings</Text>
                  </View>
                  <View>
                    <Card style={styles.card}>
                      <CardItem style={{ borderRadius: 5 }}>
                        <Text style={styles.headingText}>Notifications</Text>
                      </CardItem>

                      <FieldControl
                        name="notifyMatches"
                        render={({ handler }) => (
                          <CardItem style={styles.notBlock}>
                            <Text style={styles.switchBlockHeader}>
                              Matches
                            </Text>
                            <Switch
                              onTintColor={commonColor.brandPrimary}
                              style={styles.switch2}
                              {...handler("switch")}
                            />
                          </CardItem>
                        )}
                      />
                      <FieldControl
                        name="notifyMessages"
                        render={({ handler }) => (
                          <CardItem style={styles.notBlock}>
                            <Text style={styles.switchBlockHeader}>
                              Messages
                            </Text>
                            <Switch
                              onTintColor={commonColor.brandPrimary}
                              style={styles.switch2}
                              {...handler("switch")}
                            />
                          </CardItem>
                        )}
                      />
                    </Card>
                  </View>
                </View>
              )}
            />
          }
          <View
            style={{
              paddingTop: 15,
              paddingHorizontal: 15,
              alignItems: "center"
            }}
          >
            <GradientButton
              onPress={() =>
                Share.share(
                  {
                    message:
                      Platform.OS === "ios"
                        ? "Check out this dating app"
                        : `Check out this dating app. ${androidAppStoreLink}`,
                    url: iosAppStoreLink,
                    title: "Wow, did you see that?"
                  },
                  {
                    // Android only:
                    dialogTitle: "Share Dating App",
                    // iOS only:
                    excludedActivityTypes: [
                      "com.apple.UIKit.activity.PostToTwitter"
                    ]
                  }
                )
              }
              iconName="share-alt"
              gradientStyle={{
                height: 50,
                width: 50,
                backgroundColor: "red",
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center"
              }}
              iconStyle={{
                color: "white",
                fontSize: 30,
                paddingLeft: 10
              }}
            />

            <View
              style={{
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <GradientView style={styles.borderedView} type="horizontal">
                <Button onPress={this.logout} style={styles.logoutbutton}>
                  <Text style={styles.logoutText}>Logout </Text>
                </Button>
              </GradientView>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                elevation: 0
              }}
            >
              <Button
                style={styles.deleteButton}
                onPress={() => {
                  ActionSheet.show(
                    {
                      options: deleteButtons,
                      cancelButtonIndex: 2,
                      destructiveButtonIndex: 1,
                      title: "Delete Account"
                    },
                    this.onDeleteButtonPress
                  );
                }}
              >
                <Text style={styles.deleteText}>Delete Account</Text>
              </Button>
            </View>
          </View>
        </Content>
        <Loader loading={loading || this.state.updateLoading} />
      </Container>
    );
  }
}

const GQLUserSettingsProvider = compose(
  graphql(
    GET_USER_QUERY(`
      id
      discoverablity
      showMeMale
      showMeFemale
      searchDistance
      distanceUnit
      ageRange
      notifyMessages
      notifyMatches
    `)
  ),
  graphql(
    UPDATE_USER_MUTATION(`
      id
    `)
  )
)(Setting);
export default GQLUserSettingsProvider;
