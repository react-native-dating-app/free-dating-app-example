import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

module.exports = async (event) => {
    try {
        const graphcool = fromEvent(event)
        const api = graphcool.api('simple/v1')

        const userId = event.data.userId
        const targetId = event.data.targetId
        
        const target = await getVoteId(api, userId, targetId)
        const targetsWithIds = target.allVotes || []

        const deletedIds = await Promise.all(targetsWithIds.map(async (element) => {
            const targetId = element.id
            await deleteVote(api, targetId)
            return targetId
        }))

        return { data: { ids:  deletedIds } }
    } catch(e) {
        return { error: 'An unexpected error occured during delete match.' }
    }
  }

  async function deleteVote(api, targetId) {
    const query = `
    mutation deleteVote($targetId: ID!) {
        deleteVote(id: $targetId) {
            id
        }
    }
    `
  
    const variables = {
      targetId
    }
  
    return api.request(query, variables)
  }

  async function getVoteId(api, userId, targetId) {
    const query = `
    query allVotes($userId: ID!, $targetId: ID!) {
        allVotes(
            filter: {
              OR: [
                { AND: [{ user: { id: $userId } }, { target: { id: $targetId } }] }
                { AND: [{ user: { id: $targetId } }, { target: { id: $userId } }] }
              ]
            }
        ) {
            id
          }
    }
    `
  
    const variables = {
      userId,
      targetId
    }
  
    return api.request(query, variables)
  }