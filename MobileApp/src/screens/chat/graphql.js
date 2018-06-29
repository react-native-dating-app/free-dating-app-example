// stable
import gql from "graphql-tag";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription($senderId: ID!, $receiverId: ID!) {
    Message(
      filter: {
        AND: [
          { mutation_in: [CREATED, UPDATED, DELETED] }
          { node: { sender: { id: $senderId }, receiver: { id: $receiverId } } }
        ]
      }
    ) {
      node {
        text
        createdAt
        sender {
          id
          name
          profilePicture
        }
        receiver {
          id
          name
        }
        id
      }
    }
  }
`;
export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($text: String!, $senderId: ID!, $receiverId: ID!) {
    createMessage(text: $text, senderId: $senderId, receiverId: $receiverId) {
      id
      text
      createdAt
      sender {
        id
        name
        profilePicture
      }
      receiver {
        id
        name
      }
    }
  }
`;
export const GET_MESSAGES_QUERY = gql`
  query allMessages($userId: ID!, $matchId: ID!, $cursor: String) {
    allMessages(
      first: 15
      after: $cursor
      filter: {
        OR: [
          { AND: [{ sender: { id: $userId }, receiver: { id: $matchId } }] }
          { AND: [{ sender: { id: $matchId }, receiver: { id: $userId } }] }
        ]
      }
      orderBy: createdAt_DESC
    ) {
      text
      createdAt
      sender {
        id
        name
        profilePicture
      }
      receiver {
        id
        name
      }
      id
    }
  }
`;
