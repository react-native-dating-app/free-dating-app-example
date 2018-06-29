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
