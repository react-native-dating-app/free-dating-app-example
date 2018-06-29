//stable
import { Component } from "react";
import _ from "lodash";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import { Toast } from "native-base";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { UPDATE_USER_MUTATION } from "./../graphql/mutation";

class LocationProvider extends Component {
  state = {
    initialPosition: null,
    lastPosition: null,
    loading: true
  }
  addLocationListener = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const initialPosition = position;
        this.setState(
          {
            initialPosition,
            loading: false
          },
          () => this.updateUserLocation(position)
        );
      },
      error => {
        this.setState(
          {
            loading: false
          },
          () =>
            Toast.show({
              text: "Location disabled",
              position: "bottom",
              type: "danger",
              duration: 1000
            })
        );
      }
    );
  }
  componentDidMount() {
    if (Platform.OS === "android") {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2>Use Location?</h2> \
                    Dating app wants to change your device settings:<br/><br/>\
                    Use GPS for location<br/><br/>",
        enableHighAccuracy: true,
        ok: "YES",
        cancel: "NO"
      })
        .then(success => {
          this.addLocationListener();
        })
        .catch(error => {
          this.setState(
            {
              loading: false
            },
            () =>
              Toast.show({
                text: error.message,
                position: "bottom",
                type: "danger",
                duration: 1000
              })
          );
        });
    } else {
      this.addLocationListener();
    }
    this.watchID = navigator.geolocation.watchPosition(position => {
      const lastPosition = position;
      this.setState({
        lastPosition
      });
    });
  }
  componentWillUnmount() {
    if (this.props.updateUser) {
      this.updateUserLocation(this.state.lastPosition);
    }
    // Clear the async storage
    navigator.geolocation.clearWatch(this.watchID);
  }
  updateUserLocation = async position => {
    const longitude = _.get(position, "coords.longitude");
    const latitude = _.get(position, "coords.latitude");
    if (longitude && latitude) {
      const { mutate } = this.props;
      const userId = _.get(this.props, "data.userLocalData.id");
      if (userId) {
        try {
          await mutate({
            variables: {
              id: userId,
              latitude,
              longitude
            }
          });
        } catch (e) {}
      }
    }
  }
  render() {
    const { render, data: { error } } = this.props;
    const { initialPosition, lastPosition, loading } = this.state;
    const position = lastPosition || initialPosition;
    return render({ position, loading, error });
  }
}
LocationProvider.propTypes = {
  render: PropTypes.func.isRequired,
  updateUser: PropTypes.bool
};
LocationProvider.defaultProps = {
  updateUser: false
};

const GET_USER_LOCAL_DATA = graphql(
  gql`
    query {
      userLocalData @client {
        id
      }
    }
  `
);

export default compose(
  GET_USER_LOCAL_DATA,
  graphql(UPDATE_USER_MUTATION("id"))
)(LocationProvider);
