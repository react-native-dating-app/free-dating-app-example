//stable
import React, { Component } from "react";
import { View, Platform, WebView, Modal } from "react-native";
import {
  Button,
  Text,
  Spinner,
  Toast,
  Icon,
  Left,
  Body,
  Right,
  Item
} from "native-base";
import { Fonts } from "../variables";
import DeviceInfo from "react-native-device-info";
import { graphql, compose } from "react-apollo";
import OneSignal from "react-native-onesignal";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
import {
  UPDATE_USER_LOCAL_MUTATION,
  UPDATE_USER_MUTATION,
  AUTHENTICATE_USER_MUTATION,
  USER_SIGNUP_MUTATION
} from "./../graphql/mutation";
import { normalizeAge } from "../utils";
import LocationProvider from "../containers/locationProvider";
import { setToken, destroyToken } from "./../../configureClient";
import styles from "./styles";

/**
 * User facebook login component
 */
class UserLogin extends Component {
  state = {
    loading: false,
    modalVisible: false,
    url: "",
    title: ""
  }
  position = null
  componentWillMount() {
    OneSignal.addEventListener("ids", this.onIds);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener("ids", this.onIds);
  }
  onIds = device => {
    this.oneSignalDeviceInfo = device;
  }
  setLoadingToFalse = (callback = () => {}) => {
    this.setState(
      {
        loading: false
      },
      callback
    );
  }
  close() {
    this.setState({ modalVisible: false });
  }
  TermsAndConditions(url, title) {
    this.setState({ url, title, modalVisible: true });
  }
  // Update user data
  updateUser = async userId => {
    const { updateMutation } = this.props;
    const oneSignalDeviceInfo = this.oneSignalDeviceInfo;
    const oneSignalPlayerId = _.get(oneSignalDeviceInfo, "userId");
    try {
      if (oneSignalPlayerId) {
        await updateMutation({
          variables: {
            id: userId,
            active: true,
            oneSignalPlayerId: _.get(oneSignalDeviceInfo, "userId")
          }
        });
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  // User sign in mutation
  signInUser = async (userId, token) => {
    const { updateUserData } = this.props;
    if (token) {
      try {
        // Save the token in async storage
        await setToken(token);
        // Update user's data
        await this.updateUser(userId);
        // Update user's data locally
        await updateUserData({
          variables: {
            id: userId
          }
        });
      } catch (e) {
        throw new Error(e);
      }
    } else {
      throw new Error("No token found in response");
    }
  }

  fetchFbUserData = data => {
    const infoRequestParams = {
      fields: {
        string:
          "name,first_name,id,last_name,email,gender,birthday,picture.height(500),cover,friends,age_range,photos"
      }
    };
    const infoRequestConfig = {
      httpMethod: "GET",
      version: "v2.11",
      parameters: infoRequestParams,
      accessToken: data.accessToken.toString()
    };

    const responseInfoCallback = async (error, result) => {
      if (error) {
        this.setLoadingToFalse(() =>
          Toast.show({
            text: "Error fetching data: " + error.toString(),
            position: "bottom",
            type: "warning",
            buttonText: "Okay"
          })
        );
      } else {
        const { signUpUser, authenticateUser, onError, onSuccess } = this.props;

        // Authenticate user
        try {
          // Authentication call
          const response = await authenticateUser({
            variables: {
              email: result.email,
              password: result.id
            }
          });

          const userId = _.get(response, "data.authenticateUser.id");
          const token = _.get(response, "data.authenticateUser.token");
          // Sign in user
          await this.signInUser(userId, token);
          this.setLoadingToFalse(() => onSuccess());
        } catch (err) {
          try {
            const mutationErrors = JSON.parse(JSON.stringify(err));
            // Check for invalid credentials error ( code 5001 )
            if (
              _.get(mutationErrors, "graphQLErrors") &&
              mutationErrors.graphQLErrors.some(
                errObj =>
                  errObj.code == 5001 &&
                  errObj.path.includes("authenticateUser")
              )
            ) {
              // Create a new user
              let payload = {
                email: result.email,
                password: result.id,
                firstName: result.first_name,
                lastName: result.last_name,
                name: result.name,
                gender:
                  result.gender === "male"
                    ? "Male"
                    : result.gender === "female" ? "Female" : "Others",
                averageAge: result.age_range
                  ? normalizeAge(result.age_range)
                  : undefined,
                profileUrl: "https://www.facebook.com/" + result.id,
                profilePicture: _.get(result, "picture.data.url") || undefined,
                coverPicture: _.get(result, "cover.source)") || undefined,
                deviceId: DeviceInfo.getUniqueID(),
                devicePlatform: Platform.OS === "ios" ? "Ios" : "Android",
                latitude: this.position.coords.latitude,
                longitude: this.position.coords.longitude
              };
              payload = JSON.parse(JSON.stringify(payload));
              // User signup call
              const signUpResponse = await signUpUser({ variables: payload });

              const userId = _.get(signUpResponse, "data.signupUser.id");
              const token = _.get(signUpResponse, "data.signupUser.token");

              // Sign in user
              await this.signInUser(userId, token);
              this.setLoadingToFalse(() => onSuccess());
            } else {
              throw new Error(err);
            }
          } catch (e) {
            try {
              await LoginManager.logOut();
              await destroyToken();
              this.setLoadingToFalse(() => onError(e));
            } catch (E) {
              this.setLoadingToFalse(() => onError(E));
            }
          }
        }
      }
    };
    const infoRequest = new GraphRequest(
      "/me",
      infoRequestConfig,
      responseInfoCallback
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }
  login = () => {
    if (!this.position) {
      Toast.show({
        text: "Please enable your location",
        position: "bottom",
        type: "warning",
        buttonText: "Okay"
      });
    } else {
      this.loginwithfacebook();
    }
  }
  loginwithfacebook = async () => {
    this.setState(
      {
        loading: true
      },
      () =>
        LoginManager.logInWithReadPermissions([
          "public_profile",
          "email",
          "user_birthday",
          "user_friends"
        ]).then(
          result => {
            if (result.isCancelled) {
              this.setLoadingToFalse(() =>
                Toast.show({
                  text: "Login was cancelled",
                  position: "bottom",
                  type: "warning",
                  buttonText: "Okay"
                })
              );
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                if (data.accessToken) {
                  // fetch the user data
                  this.fetchFbUserData(data);
                }
              });
            }
          },
          error => {
            this.setLoadingToFalse(() =>
              Toast.show({
                text: "Login failed with error: " + error,
                position: "bottom",
                type: "danger",
                buttonText: "Okay"
              })
            );
          }
        )
    );
  }
  render() {
    const { loading } = this.state;
    return (
      <View style={styles.main}>
        <LocationProvider
          render={({ position }) => {
            this.position = position;
            return (
              <Button
                light
                rounded
                style={styles.loginButton}
                onPress={this.login}
                disabled={loading}
              >
                {!loading ? (
                  <Text uppercase={false} style={styles.loginButtonText}>
                    Login with Facebook
                  </Text>
                ) : (
                  <Spinner color="blue" />
                )}
              </Button>
            );
          }}
        />
        <Text
          style={{
            color: "#fff",
            alignSelf: "center",
            textAlign: "center",
            marginTop: 10,
            paddingHorizontal: 20,
            fontFamily: Fonts.PoppinsRegular
          }}
        >
          {" "}
          By tapping "Login" you agree to our{"\n"}
          <Text
            onPress={() =>
              this.TermsAndConditions(
                "https://market.nativebase.io/terms-conditions",
                "Terms"
              )
            }
            style={{
              textDecorationLine: "underline",
              color: "#fff",
              marginLeft: 10
            }}
          >
            {" "}
            Terms{" "}
          </Text>and{" "}
          <Text
            onPress={() =>
              this.TermsAndConditions(
                "https://market.nativebase.io/privacy-policy",
                "Privacy Policy"
              )
            }
            style={{ textDecorationLine: "underline", color: "#fff" }}
          >
            Privacy Policy
          </Text>
        </Text>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.close()}
          backDropOpacity={1}
        >
          <View>
            <Item
              onPress={() => this.setState({ modalVisible: false })}
              style={{
                height: 60,
                flexDirection: "row"
              }}
            >
              <Left />
              <Body style={{ flex: 4 }}>
                <Text
                  style={{ color: "#332557", fontSize: 18, fontWeight: "bold" }}
                >
                  {this.state.title}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon
                  onPress={() => this.setState({ modalVisible: false })}
                  style={{
                    paddingLeft: 10,
                    marginLeft: 20,
                    marginTop: 5,
                    width: 50
                  }}
                  name="md-close"
                />
              </Right>
            </Item>
          </View>
          <WebView
            source={{
              uri: this.state.url
            }}
          />
        </Modal>
      </View>
    );
  }
}

UserLogin.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func
};

const GQLUserLogin = compose(
  graphql(USER_SIGNUP_MUTATION, {
    name: "signUpUser"
  }),
  graphql(UPDATE_USER_LOCAL_MUTATION, {
    name: "updateUserData"
  }),
  graphql(AUTHENTICATE_USER_MUTATION, {
    name: "authenticateUser"
  }),
  graphql(
    UPDATE_USER_MUTATION(`
      id
    `),
    { name: "updateMutation" }
  )
)(UserLogin);

export default GQLUserLogin;
