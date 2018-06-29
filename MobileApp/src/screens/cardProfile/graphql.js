// stable
import gql from "graphql-tag";

export const GET_USER_DATA = gql`
  query User($id: ID!) {
    User(id: $id) {
      name
      averageAge
      profilePicture
      worksAt
      jobTitle
      interests {
        id
        name
      }
      description
      instagram
      instaPictures
      instaUserName
      pictures {
        id
        url
      }
      picturePreferences
    }
  }
`;

export const USER_SUBSCRIPTION = gql`
  subscription($id: ID!) {
    User(filter: { AND: [{ mutation_in: [UPDATED] }, { node: { id: $id } }] }) {
      node {
        id
      }
    }
  }
`;
