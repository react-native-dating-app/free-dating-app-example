// stable
import gql from "graphql-tag";

export const GET_USER_MATCHES_QUERY = gql`
  query getMatches($userId: ID!) {
    User(id: $userId) {
      targets(
        filter: {
          AND: [
            { isLiked: true }
            {
              target: {
                targets_some: { target: { id: $userId }, isLiked: true }
                active: true
                deleted: false
              }
            }
          ]
        }
      ) {
        id
        target {
          name
          id
          averageAge
          profilePicture
          sentMessages(last: 1, filter: { receiver: { id: $userId } }) {
            text
            createdAt
          }
        }
      }
    }
  }
`;

export const TARGET_SUBSCRIPTION = gql`
  subscription {
    Vote(filter: { mutation_in: [CREATED, UPDATED, DELETED] }) {
      node {
        id
      }
    }
  }
`;
