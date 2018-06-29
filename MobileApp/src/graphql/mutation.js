import gql from "graphql-tag";

export const UPDATE_USER_MUTATION = payload => gql`
  mutation updateUser(
    $id: ID!, 
    $oneSignalPlayerId: String,
    $discoverablity: Boolean,
    $showMeMale: Boolean,
    $showMeFemale: Boolean,
    $searchDistance: Float,
    $distanceUnit: DistanceUnit,
    $ageRange: [Int!],
    $notifyMatches: Boolean,
    $notifyMessages: Boolean
    $deleted: Boolean
    $active: Boolean
    $jobTitle: String
    $description: String
    $worksAt: String
    $instagram: Boolean
    $spotify: Boolean
    $interestsIds: [ID!]
    $picturesIds: [ID!]
    $instaPictures: [String!]
    $instaUserName: String
    $picturePreferences: [String!]
    $profilePicture: String
) {
    updateUser(
        id: $id, 
        oneSignalPlayerId: $oneSignalPlayerId,
        discoverablity: $discoverablity,
        showMeMale: $showMeMale,
        showMeFemale: $showMeFemale,
        searchDistance: $searchDistance,
        distanceUnit: $distanceUnit,
        ageRange: $ageRange,
        notifyMatches: $notifyMatches,
        notifyMessages: $notifyMessages,
        deleted: $deleted,
        active: $active,
        jobTitle: $jobTitle,
        description: $description,
        worksAt: $worksAt,
        instagram: $instagram,
        spotify: $spotify,
        interestsIds: $interestsIds,
        picturesIds: $picturesIds,
        instaPictures: $instaPictures,
        instaUserName: $instaUserName,
        picturePreferences: $picturePreferences,
        profilePicture: $profilePicture
    ) {
        ${payload.toString()}
    }
  }
`;

export const CREATE_TARGET_MUTATION = gql`
  mutation signinUser($userId: ID!, $targetId: ID!, $isLiked: Boolean!) {
    createVote(userId: $userId, targetId: $targetId, isLiked: $isLiked) {
      id
    }
  }
`;
export const UPDATE_USER_LOCAL_MUTATION = gql`
  mutation updateUserData($id: ID!) {
    updateUserData(id: $id) @client {
      id
    }
  }
`;

export const DELETE_MATCH_MUTATION = gql`
  mutation deleteMatch($userId: ID!, $targetId: ID!) {
    deleteMatch(userId: $userId, targetId: $targetId) {
      ids
    }
  }
`;
export const USER_SIGNUP_MUTATION = gql`
  mutation signupUser(
    $name: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $averageAge: Float
    $profileUrl: String!
    $profilePicture: String!
    $coverPicture: String
    $gender: String!
    $deviceId: String!
    $devicePlatform: String!
    $latitude: Float!
    $longitude: Float!
    $oneSignalPlayerId: String
  ) {
    signupUser(
      name: $name
      firstName: $firstName
      lastName: $lastName
      gender: $gender
      email: $email
      password: $password
      averageAge: $averageAge
      profileUrl: $profileUrl
      profilePicture: $profilePicture
      coverPicture: $coverPicture
      deviceId: $deviceId
      devicePlatform: $devicePlatform
      latitude: $latitude
      longitude: $longitude
      oneSignalPlayerId: $oneSignalPlayerId
    ) {
      id
      token
    }
  }
`;

export const AUTHENTICATE_USER_MUTATION = gql`
  mutation authenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      id
      token
    }
  }
`;
