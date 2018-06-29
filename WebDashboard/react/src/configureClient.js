import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat
} from 'apollo-client-preset'
import { BatchHttpLink } from 'apollo-link-batch-http'
import ConfigLocal from './config-local'
import { AUTH_TOKEN } from './constants'

// Cache the user authentication token

// Configure http link
const httpLink = new HttpLink({
  uri: ConfigLocal.API_HOST
})
// Configure Batch link
const batchlink = new BatchHttpLink({ uri: ConfigLocal.API_HOST })
// Middleware to set auth token in header
const authMiddleware = setContext(operation => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    // Make sure to actually set the headers here
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const cache = new InMemoryCache({
  dataIdFromObject: object => object.key || null
})
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
      Authorization: localStorage.getItem(AUTH_TOKEN)
        ? `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
        : null
    }
  }
})

export default () => {
  const link = ApolloLink.split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    webSocketLink,
    httpLink,
    batchlink
  )

  const client = new ApolloClient({
    link: concat(authMiddleware, link),
    cache
  })
  return client
}
