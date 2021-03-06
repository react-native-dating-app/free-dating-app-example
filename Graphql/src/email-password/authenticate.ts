import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as bcrypt from 'bcryptjs'

interface User {
  id: string
  password: string
}

interface EventData {
  email: string
  password: string
}

const SALT_ROUNDS = 10

export default async (event: FunctionEvent<EventData>) => {
  console.log(event)

  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { email, password } = event.data

    // get user by email
    const user: User = await getUserByEmail(api, email)
      .then(r => r.allUsers[0])

    // no user with this email
    if (!user) {
      return { error: 'Invalid credentials!' }
    }

    // check password
    const passwordIsCorrect = await bcrypt.compare(password, user.password)
    if (!passwordIsCorrect) {
      return { error: 'Invalid credentials!' }
    }

    // generate node token for existing User node
    const token = await graphcool.generateNodeToken(user.id, 'User')

    return { data: { id: user.id, token} }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured during authentication.' }
  }
}

async function getUserByEmail(api: GraphQLClient, email: string): Promise<{ allUsers: Array<User> }> {
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
