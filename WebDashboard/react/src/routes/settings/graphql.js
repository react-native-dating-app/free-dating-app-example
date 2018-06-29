// stable
import gql from 'graphql-tag'

export const SETTINGS_QUERY = gql`
  query SettingsQuery {
    allSettings {
      id
      googlePlayStoreLink
      iosAppStoreLink
      timezone
    }
  }
`

export const UPDATE_SETTING = gql`
  mutation UpdateSetting(
    $id: ID!
    $googleLink: String!
    $appleLink: String!
    $timezone: String!
  ) {
    updateSetting(
      id: $id
      googlePlayStoreLink: $googleLink
      iosAppStoreLink: $appleLink
      timezone: $timezone
    ) {
      id
      googlePlayStoreLink
      iosAppStoreLink
      timezone
    }
  }
`
export const CREATE_SETTING = gql`
  mutation CreateSetting(
    $googleLink: String!
    $appleLink: String!
    $timezone: String!
  ) {
    createSetting(
      googlePlayStoreLink: $googleLink
      iosAppStoreLink: $appleLink
      timezone: $timezone
    ) {
      id
    }
  }
`
