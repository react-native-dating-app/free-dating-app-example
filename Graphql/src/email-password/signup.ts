import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as bcrypt from 'bcryptjs'
import * as validator from 'validator'

interface User {
  id: string
}

interface EventData {
  email: string
  password: string
  name: string,
  firstName: string,
  lastName: string,
  averageAge: number,
  profileUrl: string,
  profilePicture: string,
  coverPicture: String
  gender: string,
  deviceId: string,
  devicePlatform: string,
  latitude: number,
  longitude: number,
  oneSignalPlayerId: string,
  role: string
}

interface UserPayload {
  name: string,
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  averageAge: number,
  profileUrl: string,
  profilePicture: string,
  coverPicture: String
  gender: string,
  deviceId: string,
  devicePlatform: string,
  latitude: number,
  longitude: number,
  oneSignalPlayerId: string,
  role: string
}

const SALT_ROUNDS = 10

export default async (event: FunctionEvent<EventData>) => {
  console.log(event)

  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { 
      name,
      firstName,
      lastName,
      email,
      password,
      averageAge,
      profileUrl,
      profilePicture,
      coverPicture,
      gender,
      deviceId,
      devicePlatform,
      latitude,
      longitude,
      oneSignalPlayerId,
      role
    } = event.data

    const userSignInPayload = {
      name,
      firstName,
      lastName,
      email,
      password,
      averageAge,
      profileUrl,
      profilePicture,
      coverPicture,
      gender,
      deviceId,
      devicePlatform,
      latitude,
      longitude,
      oneSignalPlayerId,
      role
    }

    if (!validator.isEmail(email)) {
      return { error: 'Not a valid email' }
    }

    // check if user exists already
    const userExists: boolean = await getUser(api, email)
      .then(r => !!r.allUsers[0])
    if (userExists) {
      return { error: 'Email already in use' }
    }

    // create password hash
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)

    // create new user
    const userId = await createGraphcoolUser(api, hash, userSignInPayload)

    // generate node token for new User node
    const token = await graphcool.generateNodeToken(userId, 'User')

    return { data: { id: userId, token } }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured during signup.' }
  }
}

async function getUser(api: GraphQLClient, email: string): Promise<{ allUsers: Array<User> }> {
  const query = `
    query getUserByEmail($email: String!) {
      allUsers(
        first: 1,
        filter: {
          email: $email,
          deleted: false
        }
      ) {
        id
        password
      }
    }
  `

  const variables = {
    email,
  }

  return api.request<{ allUsers: Array<User> }>(query, variables)
}

async function createGraphcoolUser(api: GraphQLClient, hash: string,  userPayload: UserPayload): Promise<string> {
  const mutation = `
    mutation createGraphcoolUser(
      $email: String!,
      $name: String!
      $firstName: String!
      $lastName: String!
      $password: String!
      $averageAge: Float
      $profileUrl: String
      $profilePicture: String
      $coverPicture: String
      $gender: Gender!
      $deviceId: String!
      $devicePlatform: Platform!
      $latitude: Float!
      $longitude: Float!
      $oneSignalPlayerId: String
      $role: Role
    ) {
      createUser(
        email: $email,
        password: $password,
        name: $name
        firstName: $firstName
        lastName: $lastName
        gender: $gender
        averageAge: $averageAge
        profileUrl: $profileUrl
        profilePicture: $profilePicture
        coverPicture: $coverPicture
        deviceId: $deviceId
        devicePlatform: $devicePlatform
        latitude: $latitude
        longitude: $longitude
        oneSignalPlayerId: $oneSignalPlayerId
        role: $role
      ) {
        id
      }
    }
  `

  const variables = {
    email: userPayload.email,
    password: hash,
    name: userPayload.name,
    firstName: userPayload.firstName,
    lastName: userPayload.lastName,
    averageAge: userPayload.averageAge,
    profileUrl: userPayload.profileUrl,
    profilePicture: userPayload.profilePicture,
    coverPicture: userPayload.coverPicture,
    gender: userPayload.gender,
    deviceId: userPayload.deviceId,
    devicePlatform: userPayload.devicePlatform,
    latitude: userPayload.latitude,
    longitude: userPayload.longitude,
    oneSignalPlayerId: userPayload.oneSignalPlayerId,
    role: userPayload.role
  }

  return api.request<{ createUser: User }>(mutation, variables)
    .then(r => r.createUser.id)
}
