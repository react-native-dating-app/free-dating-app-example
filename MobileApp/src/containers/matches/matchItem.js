// stable
import React, { Component } from "react";
import { Text, View, Left, Body, Right, ListItem } from "native-base";
import { Image, Platform } from "react-native";
import moment from "moment";
import PropTypes from "prop-types";
import _ from "lodash";
import { graphql } from "react-apollo";
import styles from "./styles";
import { decryptText } from "../../utils";
import ChatBubble from "../../components/chatBubble";
import { ENCRYPTION_SECRET_KEY } from "../../constants";
import { MESSAGE_SUBSCRIPTION } from "./../../graphql/subscription";
import { GET_MESSAGES_QUERY } from "./../../graphql/query";
import ErrorHandler from "./../../components/errorHandler";

class MatchListItem extends Component {
  state = {
    showChatBubble: false
  }
  componentDidMount() {
    /**
     * Add message subscription to show the latest message
     */
    this.addMessageSubscription();
  }
  addMessageSubscription = () => {
    const { userId, matchData, data: { subscribeToMore } } = this.props;
    const matchId = _.get(matchData, "target.id");
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: {
        senderId: matchId,
        receiverId: userId
      },
      updateQuery: () => {
        // Display the chat bubble on new messages
        this.setState(
          {
            showChatBubble: true
          },
          () => this.props.data.refetch()
        );
      },
      onError: err => console.log(err)
    });
  }
  onPressItem = () => {
    const { onPress, matchData } = this.props;
    this.setState(
      {
        showChatBubble: false
      },
      () => onPress(matchData)
    );
  }
  render() {
    const { matchData, data } = this.props;
    const match = matchData.target;
    const recentMessage = decryptText(
      _.get(data, "allMessages[0].text"),
      ENCRYPTION_SECRET_KEY
    );
    const createdAt = _.get(data, "allMessages[0].createdAt");
    const timeStamp = createdAt ? moment(createdAt) : null;
    const messageDate = (timeStamp && timeStamp.format("DD/MM/YYYY")) || "";
    const messageTime = (timeStamp && timeStamp.format("hh: ss A")) || "";
    const isRecentMessage =
      (timeStamp && timeStamp.isSame(new Date(), "day")) || false;
    const error = _.get(data, "error");

    if (error) {
      return <ErrorHandler error={error} />;
    }
    return (
      <ListItem onPress={this.onPressItem} style={{ paddingLeft: 15 }}>
        <Left style={{ flex: 1 }}>
          <Image
            source={{
              uri: match.profilePicture
            }}
            style={styles.profileImage}
          />
          {this.state.showChatBubble && (
            <ChatBubble
              style={{
                top: 25,
                right: Platform.OS === "ios" ? -10 : -15,
                backgroundColor: "#fd6dad"
              }}
            />
          )}
        </Left>
        <Body style={styles.listBody}>
          <View style={styles.bodyView}>
            <Text style={styles.bodyText}>{match.name}</Text>
          </View>
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={1}
            note
            style={styles.messageText}
          >
            {recentMessage || ""}
          </Text>
        </Body>
        <Right style={{ flex: Platform.OS === "ios" ? 1.4 : 1.5 }}>
          {isRecentMessage ? (
            <Text note>{messageTime || ""}</Text>
          ) : (
            <Text note>{messageDate || ""}</Text>
          )}
        </Right>
      </ListItem>
    );
  }
}

MatchListItem.propTypes = {
  userId: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  matchData: PropTypes.shape({
    id: PropTypes.string,
    target: PropTypes.shape({
      id: PropTypes.string,
      averageAge: PropTypes.number,
      name: PropTypes.string,
      profilePicture: PropTypes.string
    })
  })
};

export default graphql(GET_MESSAGES_QUERY, {
  options: ({ userId, matchData }) => ({
    variables: {
      userId,
      matchId: _.get(matchData, "target.id")
    }
  })
})(MatchListItem);
