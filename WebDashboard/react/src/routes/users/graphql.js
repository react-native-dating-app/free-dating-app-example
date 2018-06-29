// stable
import gql from 'graphql-tag'

export const FEED_USERS = gql`
  query User {
    allUsers(filter: { role: User }) {
      gender
      active
      deleted
      averageAge
      name
      email
      role
      latitude
      longitude
      id
    }
  }
`

export const UPDATE_MUTATION = gql`
  mutation UpdateMutation(
    $id: ID!
    $name_val: String!
    $age_val: Float!
    $gender_val: Gender!
    $role_val: Role
  ) {
    updateUser(
      id: $id
      gender: $gender_val
      role: $role_val
      averageAge: $age_val
      name: $name_val
    ) {
      lastName
    }
  }
`
export const USER_SUBSCRIPTION = gql`
  subscription {
    User(filter: { mutation_in: [UPDATED] }) {
      node {
        gender
        deleted
        active
        averageAge
        name
        email
        role
        id
      }
    }
  }
`
