import gql from 'graphql-tag'
import _ from 'lodash'
import ConfigLocal from '../../config-local'

export const MALE_COUNT_QUERY = gql`
  query MaleCount {
    _allUsersMeta(filter: { AND: [{ gender: Male }, { role: User }] }) {
      count
    }
  }
`

export const FEMALE_COUNT_QUERY = gql`
  query FemaleCount {
    _allUsersMeta(filter: { AND: [{ gender: Female }, { role: User }] }) {
      count
    }
  }
`

export const IOS_COUNT_QUERY = gql`
  query IosCount {
    _allUsersMeta(filter: { AND: [{ devicePlatform: Ios }, { role: User }] }) {
      count
    }
  }
`

export const ANDROID_COUNT_QUERY = gql`
  query AndroidCount {
    _allUsersMeta(
      filter: { AND: [{ devicePlatform: Android }, { role: User }] }
    ) {
      count
    }
  }
`
export const USERS_COUNT_QUERY = gql`
  query UsersCount {
    _allUsersMeta(filter: { role: User }) {
      count
    }
  }
`
export const SWIPES_COUNT_QUERY = gql`
  query SwipesCount {
    _allVotesMeta {
      count
    }
  }
`
export const MATCHES_COUNT_QUERY = gql`
  query MatchesCount {
    matchCount {
      count
      error
    }
  }
`

export const FEED_USERS = gql`
  query User {
    allUsers(filter: { role: User }) {
      id
      latitude
      longitude
    }
  }
`

const GOOGLE_MAP_KEY = ConfigLocal.GOOGLE_MAP_KEY

export function getBoundry(loc) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      loc[0]
    },${loc[1]}&key=${GOOGLE_MAP_KEY}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        resolve(_.get(data, 'results[0].address_components[4].long_name'))
      })
      .catch(error => {
        reject(error)
      })
  })
}
