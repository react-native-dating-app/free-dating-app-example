import gql from "graphql-tag";

// To get data for the current logged in user
export const GET_USER_QUERY = payload => gql`
  query user {
    user {
      ${payload.toString()}
    }
  }
`;

export const GET_MESSAGES_QUERY = gql`
  query allMessages($userId: ID!, $matchId: ID!) {
    allMessages(
      first: 1
      filter: { AND: [{ sender: { id: $matchId }, receiver: { id: $userId } }] }
      orderBy: createdAt_DESC
    ) {
      text
      createdAt
    }
  }
`;

export const GET_INTEREST_QUERY = gql`
  query allInterests($startsWith: String, $limit: Int, $selectedIds: [ID!]) {
    allInterests(
      first: $limit
      filter: {
        name_contains: $startsWith
        suggestToUsers: true
        id_not_in: $selectedIds
      }
    ) {
      id
      name
    }
  }
`;
