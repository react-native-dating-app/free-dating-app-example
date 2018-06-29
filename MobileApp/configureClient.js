// stable
import { AsyncStorage } from "react-native";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "apollo-utilities";
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  from,
  concat
} from "apollo-client-preset";
import { withClientState } from "apollo-link-state";
import ConfigLocal from "./config-local";

// Cache the user authentication token
let authToken = null;

// Configure http link
const httpLink = new HttpLink({
  uri: ConfigLocal.API_HOST
});
// Middleware to set auth token in header
const authMiddleware = setContext(operation => {
  return {
    // Make sure to actually set the headers here
    headers: {
      authorization: authToken || null
    }
  };
});

const cache = new InMemoryCache({
  dataIdFromObject: object => object.key || null
});

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      updateUserData: (_, { id }, { cache }) => {
        const data = {
          userLocalData: {
            __typename: "UserLocalData",
            id
          }
        };
        cache.writeData({ data });
        return null;
      }
    },
    // Hack to avoid the errors after client.resetStore
    Query: () => ({})
  },
  defaults: {
    userLocalData: {
      __typename: "UserLocalData",
      id: null
    }
  }
});

// Comment out below code to enable the cache persistance

// persistCache({
//   cache,
//   storage: AsyncStorage
// })

// Configure websocket link
const webSocketLink = new WebSocketLink({
  uri: ConfigLocal.SOCKS_HOST,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: authToken || null
    }
  }
});

// Set the token
export const setToken = token => {
  let autorizationToken = token ? `Bearer ${token}` : null;
  authToken = autorizationToken;
  // set the token in webSocketLink
  webSocketLink.subscriptionClient.connectionParams = {
    Authorization: authToken || null
  };
  return AsyncStorage.setItem("token", autorizationToken)
    .then(returnedToken => {
      client
        .resetStore()
        .then(() => Promise.resolve(returnedToken))
        .catch(err => Promise.reject(err));
    })
    .catch(err => Promise.reject(err));
};

// Get the token
export const getToken = () => {
  return AsyncStorage.getItem("token")
    .then(token => {
      authToken = token ? token : null;
      // set the token in webSocketLink
      webSocketLink.subscriptionClient.connectionParams = {
        Authorization: authToken
      };
      return Promise.resolve(authToken);
    })
    .catch(err => Promise.reject(err));
};

// Destroy token
export const destroyToken = () => {
  return AsyncStorage.removeItem("token")
    .then(() => {
      authToken = null;
      return Promise.resolve(authToken);
    })
    .catch(err => Promise.reject(err));
};

const link = ApolloLink.split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  webSocketLink,
  from([stateLink, httpLink])
);

const client = new ApolloClient({
  link: concat(authMiddleware, link),
  cache
});

export default () => {
  return client;
};
