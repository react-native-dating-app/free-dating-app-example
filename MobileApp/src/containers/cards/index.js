// stable
import React, { Component } from "react";
import _ from "lodash";
import gql from "graphql-tag";
import SwipeCards from "react-native-swipe-cards";
import { Icon, Text, Button, View, Spinner } from "native-base";
import { Image, Platform } from "react-native";
import { graphql, compose } from "react-apollo";
import { CREATE_TARGET_MUTATION } from "./../../graphql/mutation";
import UserProvider from "../../containers/userProvider";
import { getDistanceFromLatLonInKm } from "./../../utils";
import RenderTag from "../../components/renderTag";
import NoMoreCards from "../../components/noMoreData";
import { mileToKm } from "./../../utils";
import { interestsDummy } from "./../../variables";
import ErrorHandler from "../../components/errorHandler";
import Card from "./card";
import styles from "./styles";

const ArrowUp = require("../../../assets/arrow-up.png");

class Cards extends Component {
  state = {
    showUserProfile: false,
    activeCard: null,
    activeIndex: 0
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const allUsers = _.get(nextProps, "data.getAllUsers.allUsers", []);
      if (allUsers) {
        this.setState({
          activeCard: allUsers[0] || null,
          activeIndex: 0
        });
      }
    }
  }
  componentDidMount() {
    // Add subscription
    this.addUserSubscription();
  }

  addUserSubscription = () => {
    const { user, location, data: { subscribeToMore } } = this.props;
    subscribeToMore({
      document: USER_SUBSCRIPTION,
      variables: getVariables(user, location),
      updateQuery: () => {
        this.props.data.refetch();
      },
      onError: err => console.log(err)
    });
  }
  showUserProfile = () => {
    this.props.navigation.navigate("CardProfile", {
      id: this.state.activeCard.id,
      userId: _.get(this.props, "user.id"),
      onPressLike: () => this.likedByProfile()
    });
  }

  likedByProfile = async () => {
    try {
      await this.createTarget(this.state.activeCard, true);
      this.props.data.refetch();
    } catch (e) {
      throw new Error(e);
    }
  }
  calculateActiveCard = card => {
    const allUsers = _.get(this.props, "data.getAllUsers.allUsers", []);
    this.setState(
      prevState => {
        const activeIndex = prevState.activeIndex + 1;
        return {
          activeIndex,
          activeCard: allUsers[activeIndex]
        };
      },
      () => {
        if (this.state.activeIndex === 3) {
          this.props.data.refetch();
        }
      }
    );
  }
  createTarget = async (card, isLiked) => {
    const { mutate, user } = this.props;
    const userId = _.get(user, "id");
    const targetId = _.get(card, "id");
    if (userId && targetId) {
      try {
        await mutate({
          variables: {
            userId,
            targetId,
            isLiked
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
  handleMaybe = card => {
    this.calculateActiveCard(card);
    // Like
    this.createTarget(card, true);
  }
  handleNope = card => {
    this.calculateActiveCard(card);
    // Reject
    this.createTarget(card, false);
  }
  render() {
    const {
      data: { loading, error },
      location,
      user: { profilePicture }
    } = this.props;
    const allUsers = _.get(this, "props.data.getAllUsers.allUsers", []) || [];
    const activeCard = _.get(this, "state.activeCard");
    const activeCardId = _.get(activeCard, "id");
    const userLatitude = _.get(location, "coords.latitude");
    const userLongitude = _.get(location, "coords.longitude");
    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorHandler error={error} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              flex: Platform.OS === "ios" ? 5 : 5,
              flexDirection: "column"
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: activeCardId ? 4 : 6 }}>
                <SwipeCards
                  cards={allUsers}
                  cardKey={"id"}
                  renderCard={cardData => {
                    let index = null;
                    const cardId = _.get(cardData, "id");
                    allUsers.every((o, i) => {
                      if (o.id === cardId) {
                        index = i;
                        return false;
                      }
                      return true;
                    });
                    return (
                      <Card
                        index={index}
                        activeIndex={this.state.activeIndex}
                        active={activeCardId === cardId}
                        {...cardData}
                      />
                    );
                  }}
                  renderNoMoreCards={() => (
                    <NoMoreCards
                      style={{}}
                      userProfilePic={profilePicture}
                      message="There's no one new around you!"
                      card
                    />
                  )}
                  // handleMaybe={this.handleMaybe}
                  handleNope={this.handleNope}
                  handleYup={this.handleMaybe}
                  hasMaybeAction
                  stack={true}
                  smoothTransition={true}
                  stackDepth={3}
                  stackOffsetY={20}
                  dragY={false}
                  showYup={true}
                  showNope={true}
                  onClickHandler={() => {}}
                  nopeStyle={styles.nopeStyle}
                  nopeTextStyle={styles.nopeTextSTyle}
                  yupStyle={styles.yupStyle}
                  yupTextStyle={styles.yupTextStyle}
                  yupText={"LIKE"}
                  nopeText={"NOPE"}
                />
              </View>
              <View style={styles.distanceView}>
                {activeCardId && (
                  <View style={{ alignSelf: "center", top: -20, left: 15 }}>
                    <Icon style={styles.iconLocation} name="ios-pin-outline" />
                    <View>
                      <Text style={[styles.textStyledist, { right: 5 }]}>
                        {Math.floor(
                          getDistanceFromLatLonInKm(
                            userLatitude,
                            userLongitude,
                            activeCard.latitude,
                            activeCard.longitude
                          )
                        )}{" "}
                        km
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {activeCardId && (
              <View style={styles.tagStyle}>
                <View>
                  <RenderTag
                    tags={
                      activeCard.interests.length
                        ? activeCard.interests
                        : interestsDummy
                    }
                  />
                </View>
                <View style={styles.arrowUpIconStyle}>
                  <Button transparent onPress={this.showUserProfile}>
                    <Image source={ArrowUp} style={{ width: 30, height: 30 }} />
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

// Filter users data
const GET_USERS_QUERY = gql`
  query getAllUsers(
    $userId: ID!
    $showMe: String
    $minAge: Float
    $maxAge: Float
    $latitude: Float!
    $longitude: Float!
    $count: Int!
    $distance: Float!
  ) {
    getAllUsers(
      userId: $userId
      showMe: $showMe
      minAge: $minAge
      maxAge: $maxAge
      latitude: $latitude
      longitude: $longitude
      count: $count
      distance: $distance
    ) {
      allUsers
    }
  }
`;

const USER_SUBSCRIPTION = gql`
  subscription {
    User(filter: { mutation_in: [CREATED, UPDATED, DELETED] }) {
      node {
        id
      }
    }
  }
`;

const getVariables = (user, location) => {
  const variables = {
    userId: _.get(user, "id")
  };
  if (_.get(user, "showMeMale") && !_.get(user, "showMeFemale")) {
    variables.showMe = "Male";
  } else if (!_.get(user, "showMeMale") && _.get(user, "showMeFemale")) {
    variables.showMe = "Female";
  }
  variables.minAge = _.get(user, "ageRange[0]");
  variables.maxAge = _.get(user, "ageRange[1]");
  variables.latitude = _.get(location, "coords.latitude");
  variables.longitude = _.get(location, "coords.longitude");
  variables.count = 4;
  const distanceUnit = _.get(location, "distanceUnit");
  let distance = _.get(user, "searchDistance");
  if (distanceUnit === "Mile") {
    distance = mileToKm(distance);
  }
  variables.distance = distance;
  return variables;
};
const GQLUserProvider = compose(
  graphql(GET_USERS_QUERY, {
    options: ({ user, location }) => {
      return { variables: getVariables(user, location) };
    }
  }),
  graphql(CREATE_TARGET_MUTATION)
)(Cards);

const CardsWithUserData = props => (
  <UserProvider
    payload={`id
       name
       showMeMale
       showMeFemale
       searchDistance
       distanceUnit
       ageRange
       profilePicture
      `}
    renderLoading={() => <Spinner />}
    renderError={error => <ErrorHandler error={error} />}
    render={user => <GQLUserProvider user={user} {...props} />}
  />
);

export default CardsWithUserData;
