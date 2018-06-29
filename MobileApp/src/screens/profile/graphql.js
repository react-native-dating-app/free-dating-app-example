// stable
import gql from "graphql-tag";

export const DELETE_FILE_MUTATION = gql`
  mutation deleteFile($id: ID!) {
    deleteFile(id: $id) {
      id
    }
  }
`;

export const CREATE_FILE_MUTATION = gql`
  mutation createFile(
    $contentType: String!
    $name: String!
    $secret: String!
    $size: Int!
    $url: String!
  ) {
    createFile(
      contentType: $contentType
      name: $name
      secret: $secret
      size: $size
      url: $url
    ) {
      id
      url
    }
  }
`;
