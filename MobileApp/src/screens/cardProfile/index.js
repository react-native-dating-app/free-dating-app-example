// stable
import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { Text, Content, Container, Spinner, Toast } from "native-base";
import _ from "lodash";
import { Linking } from "react-native";
import { CREATE_TARGET_MUTATION } from "./../../graphql/mutation";
import { GET_USER_DATA, USER_SUBSCRIPTION } from "./graphql";
import Loader from "./../../components/loader";
import Header from "../../components/header";
import ErrorHandler from "../../components/errorHandler";
import CardDetails from "./../../components/cardDetails";

class CardProfile extends Component {
  state = {
    loading: false
  }
  componentDidMount() {
    this.addUserSubscription();
  }
  addUserSubscription = () => {
    const { navigation, data: { subscribeToMore } } = this.props;
    subscribeToMore({
      document: USER_SUBSCRIPTION,
      variables: {
        id: navigation.getParam("id")
      },
      updateQuery: () => {
        this.props.data.refetch();
      },
      onError: err => console.log(err)
    });
  }
  handleLike = () => {
    const { navigation } = this.props;
    const handleLike = navigation.getParam("onPressLike");
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          await handleLike();
          this.setState(
            {
              loading: false
            },
            () => {
              navigation.goBack();
            }
          );
        } catch (e) {
          console.log(e);
          this.setState(
            {
              loading: false
            },
            () =>
              Toast.show({
                text: "Unable to like user",
                position: "bottom",
                type: "warning",
                duration: 1000
              })
          );
        }
      }
    );
  }
  onPressConnect = async instaUserName => {
    try {
      if (!instaUserName) {
        return Toast.show({
          text: "Error in redirecting to Insta app",
          position: "bottom",
          type: "danger",
          duration: 1000
        });
      }
      const appUrl = `http://instagram.com/_u/${instaUserName}/`;
      const webUrl = `https://www.instagram.com/${instaUserName}/`;
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        const resApp = await Linking.openURL(appUrl);
        if (!resApp) {
          return Toast.show({
            text: "Error in opening instagram app",
            position: "bottom",
            type: "danger",
            duration: 1000
          });
        }
        return;
      }
      const resWeb = await Linking.openURL(webUrl);
      if (!resWeb) {
        Toast.show({
          text: "Error in opening instagram web view",
          position: "bottom",
          type: "danger",
          duration: 1000
        });
      }
    } catch (error) {
      Toast.show({
        text: "Error in Instagram",
        position: "bottom",
        type: "danger",
        duration: 1000
      });
    }
  }
  render() {
    const { navigation, data: { loading, error } } = this.props;
    const activeCard = _.get(this.props, "data.User");
    const isSelfProfile = !navigation.getParam("userId");
    if (error) {
      return <ErrorHandler error={error} />;
    }
    return (
      <Container>
        <Header
          backButton
          title="Profile"
          onPressBack={() => navigation.goBack()}
        />
        <Content style={{ flex: 1, backgroundColor: "white" }}>
          {activeCard && (
            <CardDetails
              onPressConnect={this.onPressConnect}
              handleLike={this.handleLike}
              isSelfProfile={isSelfProfile}
              activeCard={activeCard}
            />
          )}
          {error && <Text>Unable to fetch profile</Text>}
          {loading && <Spinner />}
          <Loader loading={this.state.loading} />
        </Content>
      </Container>
    );
  }
}

export default compose(
  graphql(GET_USER_DATA, {
    options: ({ navigation }) => ({
      variables: {
        id: navigation.getParam("id")
      }
    })
  }),
  graphql(CREATE_TARGET_MUTATION)
)(CardProfile);
