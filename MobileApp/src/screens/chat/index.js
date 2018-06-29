// stable
import { GiftedChat, Bubble, MessageText, Time } from "react-native-gifted-chat";
import React from "react";
import _ from "lodash";
import { graphql, compose } from "react-apollo";
import {
  Container,
  Spinner,
  Icon,
  ActionSheet,
  Toast,
  Item,
  View
} from "native-base";
import UserProvider from "./../../containers/userProvider";
import { DELETE_MATCH_MUTATION } from "./../../graphql/mutation";
import ReportUser from "../../containers/ReportUser";
import {
  GET_MESSAGES_QUERY,
  MESSAGE_SUBSCRIPTION,
  CREATE_MESSAGE_MUTATION
} from "./graphql";
import { Alert } from "react-native";
import Header from "../../components/header";
import { ENCRYPTION_SECRET_KEY } from "../../constants";
import { encryptText, decryptText } from "../../utils";
import Loader from "../../components/loader";
import { Fonts } from "../../variables";
import ErrorHandler from "../../components/errorHandler";

// Normalize the message's according to the gifted chat schema
const normalizeMessages = messages => {
  return messages.map(item => ({
    _id: item.id,
    text: decryptText(item.text, ENCRYPTION_SECRET_KEY),
    createdAt: item.createdAt,
    user: {
      _id: item.sender.id,
      name: item.sender.name,
      avatar: item.sender.profilePicture
    }
  }));
};

class Chat extends React.Component {
  state = {
    loading: false,
    isFetchingMore: false
  }
  buttons = ["Unmatch", "Report", "Block", "Cancel"]
  loadMoreMessages = _.throttle(this.loadMoreMessages, 1000, {
    leading: true,
    trailing: false
  })
  componentDidMount() {
    // Add subscription
    this.addMessageSubscription();
  }
  addMessageSubscription = () => {
    const { user, navigation, data: { subscribeToMore } } = this.props;
    const userId = _.get(user, "id");
    const matchId = _.get(navigation, "state.params.match.target.id");
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: {
        senderId: matchId,
        receiverId: userId
      },
      updateQuery: (previousState, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousState;
        } else if (subscriptionData.errors) {
          return previousState;
        }
        const newMessage = _.get(subscriptionData, "data.Message.node");
        const prevMessages = _.get(previousState, "allMessages");
        let messages = [newMessage].concat(prevMessages);

        return {
          allMessages: messages
        };
      },
      onError: err => console.log(err)
    });
  }
  onSendMessage = async (messages = []) => {
    const { user, navigation, createMessage } = this.props;
    const userId = _.get(user, "id");
    const matchId = _.get(navigation, "state.params.match.target.id");
    const text = encryptText(_.get(messages, "[0].text"), ENCRYPTION_SECRET_KEY);

    if (userId && matchId && text) {
      try {
        await createMessage({
          variables: {
            senderId: userId,
            receiverId: matchId,
            text
          },
          optimisticResponse: {
            __typename: "Mutation",
            createMessage: {
              __typename: "Message",
              id: Math.round(Math.random() * -1000000),
              text,
              createdAt: new Date().toISOString(),
              sender: {
                __typename: "User",
                id: userId,
                name: "Faking It",
                profilePicture: "Faking It"
              },
              receiver: {
                id: matchId,
                name: "Faking It",
                __typename: "User"
              }
            }
          },
          update: (proxy, { data }) => {
            // Read the data from our cache for this query.
            const queryData = proxy.readQuery({
              query: GET_MESSAGES_QUERY,
              variables: {
                userId,
                matchId
              }
            });
            // Add our message from the mutation to the end.
            let insertAt = 0;

            queryData.allMessages.every((message, index) => {
              if (message.createdAt > data.createMessage.createdAt) {
                return true;
              }
              insertAt = index;
              return false;
            });

            queryData.allMessages.splice(
              queryData.allMessages.legth - (insertAt + 1),
              0,
              data.createMessage
            );

            // Write our data back to the cache.
            proxy.writeQuery({
              query: GET_MESSAGES_QUERY,
              variables: {
                userId,
                matchId
              },
              data: queryData
            });
          }
        });
      } catch (e) {
        Toast.show({
          text: "Not able to send message",
          position: "top",
          type: "danger",
          duration: 1000
        });
      }
    }
  }
  renderTick(props) {
    const { user } = this.props;
    const userId = _.get(user, "id");
    if (props._id < 0) {
      return (
        <Icon
          name="md-time"
          style={{ fontSize: 16, color: "#ddd", marginRight: 10 }}
        />
      );
    } else if (props.user._id === userId) {
      return (
        <Icon
          name="md-done-all"
          style={{ fontSize: 16, color: "#fff", marginRight: 10 }}
        />
      );
    }
    return null;
  }
  renderBubble = props => {
    return (
      <Bubble
        renderTicks={prop => this.renderTick(prop)}
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#7873F5"
          },
          left: {
            backgroundColor: "#fd6dad"
          }
        }}
      />
    );
  }
  renderMessageText(props) {
    const textStyle = {
      fontSize: 16,
      fontFamily: Fonts.Poppins,
      color: "#fff"
    };
    const linkStyle = { fontSize: 16, color: "blue" };
    return (
      <MessageText
        textStyle={{ left: textStyle, right: textStyle }}
        linkStyle={{ left: linkStyle, right: linkStyle }}
        {...props}
      />
    );
  }
  renderTime(props) {
    const textStyle = {
      fontSize: 10,
      fontFamily: Fonts.PoppinsRegular,
      color: "#fff"
    };
    return <Time textStyle={{ left: textStyle, right: textStyle }} {...props} />;
  }

  renderSend(props) {
    return (
      <Item
        {...props}
        style={{ marginBottom: 5, marginRight: 10, borderBottomWidth: 0 }}
        onPress={() =>
          this.text && this.text.trim()
            ? this.onSend({ text: this.text }, true)
            : null
        }
      >
        <Icon name="md-send" size={29} style={{ color: "#fd6dad" }} />
      </Item>
    );
  }
  navigateToProfile = () => {
    const { navigation } = this.props;
    navigation.navigate({
      routeName: "CardProfile",
      key: "CardProfile",
      params: {
        id: _.get(navigation, "state.params.match.target.id")
      }
    });
  }
  onDeleteTarget = async index => {
    if (index === 0 || index === 2) {
      const { deleteMatch, navigation, user } = this.props;
      const userId = _.get(user, "id");
      const targetId = _.get(navigation, "state.params.match.target.id");

      this.setState(
        {
          loading: true
        },
        async () => {
          try {
            await deleteMatch({
              variables: {
                userId,
                targetId
              }
            });
            this.setState(
              {
                loading: false
              },
              () => navigation.goBack()
            );
          } catch (e) {
            Toast.show({
              text: "Unable to delete match",
              position: "bottom",
              type: "danger",
              duration: 1000
            });
            this.setState({
              loading: false
            });
          }
        }
      );
    }
    if (index === 1) {
      this._modal.open();
    }
    // if (index === 2) {
    //   Alert.alert("user blocked");
    // }
  }
  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  }
  loadMoreMessages() {
    const { data: { fetchMore, allMessages = [] } } = this.props;
    if (!this.isStartFetching) {
      this.isStartFetching = true;
      this.setState(
        {
          isFetchingMore: true
        },
        () => {
          fetchMore({
            variables: {
              cursor: _.get(
                allMessages[allMessages.length - 1],
                "id",
                undefined
              )
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              this.setState({
                isFetchingMore: false
              });
              if (!fetchMoreResult.allMessages) {
                this.isStartFetching = false;
                return previousResult;
              }
              const filteredMessages = _.filter(
                fetchMoreResult.allMessages,
                o => !_.some(allMessages, message => message.id === o.id)
              );
              this.isStartFetching = false;
              return Object.assign({}, previousResult, {
                // Append the new messages to the old one
                allMessages: [
                  ...previousResult.allMessages,
                  ...filteredMessages
                ]
              });
            }
          });
        }
      );
    }
  }
  render() {
    const { navigation, data, user } = this.props;
    const header =
      _.get(navigation, "state.params.match.target.name") +
      ", " +
      _.get(navigation, "state.params.match.target.averageAge");
    const messages = normalizeMessages(_.get(data, "allMessages") || []);
    const userId = _.get(user, "id");
    const loading = _.get(data, "loading");
    const error = _.get(data, "error");

    if (error) {
      return (
        <Container style={{ flex: 1 }}>
          <Header
            backButton
            title={header}
            onPressBack={() => navigation.goBack()}
          />
          <ErrorHandler error={error} />;
        </Container>
      );
    }

    return (
      <Container style={{ flex: 1 }}>
        <Header
          backButton
          title={header}
          onPressHeader={this.navigateToProfile}
          onPressBack={() => navigation.goBack()}
          right={
            <Item
              style={{
                borderBottomWidth: 0,
                width: 40,
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={() =>
                ActionSheet.show(
                  {
                    options: this.buttons,
                    cancelButtonIndex: 3,
                    destructiveButtonIndex: 0
                  },
                  this.onDeleteTarget
                )
              }
            >
              <Icon name="md-more" style={{ fontSize: 30, color: "#fd6dad" }} />
            </Item>
          }
        />
        <GiftedChat
          messages={messages}
          onSend={this.onSendMessage}
          user={{
            _id: userId
          }}
          renderBubble={this.renderBubble}
          renderMessageText={this.renderMessageText}
          renderTime={this.renderTime}
          onPressAvatar={this.navigateToProfile}
          renderSend={this.renderSend}
          listViewProps={{
            scrollEventThrottle: 400,
            onScroll: ({ nativeEvent }) => {
              if (this.isCloseToTop(nativeEvent)) {
                this.loadMoreMessages();
              }
            }
          }}
        />
        <ReportUser
          getReferencemodal={c => {
            this._modal = c;
          }}
        />
        {(loading || this.state.isFetchingMore) && (
          <View style={{ position: "absolute", left: 0, right: 0, top: 70 }}>
            <Spinner color="black" />
          </View>
        )}
        <Loader loading={this.state.loading} />
      </Container>
    );
  }
}

const GQLMessageProvider = compose(
  graphql(GET_MESSAGES_QUERY, {
    options: ({ user, navigation }) => ({
      variables: {
        userId: _.get(user, "id"),
        matchId: _.get(navigation, "state.params.match.target.id")
      }
    })
  }),
  graphql(CREATE_MESSAGE_MUTATION, {
    name: "createMessage"
  }),
  graphql(DELETE_MATCH_MUTATION, {
    name: "deleteMatch"
  })
)(Chat);

const ChatWithUserData = props => (
  <UserProvider
    renderLoading={() => <Spinner />}
    renderError={error => <ErrorHandler error={error} />}
    render={user => <GQLMessageProvider user={user} {...props} />}
  />
);

export default ChatWithUserData;
