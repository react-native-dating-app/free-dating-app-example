// stable
import React, { Component } from "react";
import _ from "lodash";
import { DELETE_MATCH_MUTATION } from "./../../graphql/mutation";
import { GET_USER_MATCHES_QUERY, TARGET_SUBSCRIPTION } from "./graphql";
import { Spinner, View, Toast, Content } from "native-base";
import { graphql, compose } from "react-apollo";
import UserProvider from "./../userProvider";
import ErrorHandler from "../../components/errorHandler";
import Match from "./match";
import Loader from "./../../components/loader";
import NoMatch from "../../components/noMoreData";

import styles from "./styles";

class Matches extends Component {
  state = {
    loading: false
  }

  componentDidMount() {
    /*
     Add target subscription,
     So any changes in the vote reflects immediately
    **/
    this.addTargetSubscription();
  }

  addTargetSubscription = () => {
    const { user, data: { subscribeToMore } } = this.props;
    const userId = _.get(user, "id");
    subscribeToMore({
      document: TARGET_SUBSCRIPTION,
      variables: {
        userId
      },
      updateQuery: () => {
        this.props.data.refetch();
      },
      onError: err => console.log(err)
    });
  }

  // Function needs to be called on delete match
  onDeleteMatch = async data => {
    const { mutate, user } = this.props;
    const userId = _.get(user, "id");
    const targetId = _.get(data, "target.id");
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          await mutate({
            variables: {
              userId,
              targetId
            }
          });
          this.setState({
            loading: false
          });
        } catch (e) {
          this.setState(
            {
              loading: false
            },
            () =>
              Toast.show({
                text: "Unable to delete match",
                position: "bottom",
                type: "warning",
                duration: 1000
              })
          );
        }
      }
    );
  }
  render() {
    const { data: { User, loading, error }, onPressMatch, user } = this.props;
    const matches = _.uniqBy(_.get(User, "targets", []), "target.id") || [];
    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorHandler error={error} />;
    }
    return matches && matches.length ? (
      <Content style={{ backgroundColor: "#fcfcfc" }}>
        <View>
          <Match
            userId={_.get(user, "id")}
            matches={matches}
            onPress={onPressMatch}
            onDeleteMatch={this.onDeleteMatch}
          />
          <Loader loading={this.state.loading} />
        </View>
      </Content>
    ) : (
      <Content style={{ backgroundColor: "#fcfcfc" }}>
        <View style={styles.noMatchView}>
          <NoMatch
            userProfilePic={user.profilePicture}
            message="There are no matches!"
          />
        </View>
      </Content>
    );
  }
}

const GQLMatchProvider = compose(
  graphql(DELETE_MATCH_MUTATION),
  graphql(GET_USER_MATCHES_QUERY, {
    options: ({ user }) => ({
      variables: {
        userId: _.get(user, "id")
      }
    })
  })
)(Matches);

const UserWithMatchData = props => (
  <UserProvider
    payload={`id
      name
      profilePicture
    `}
    renderLoading={() => <Spinner />}
    renderError={error => <ErrorHandler error={error} />}
    render={user => <GQLMatchProvider user={user} {...props} />}
  />
);
export default UserWithMatchData;
