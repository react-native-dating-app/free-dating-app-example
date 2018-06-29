// Click "EXAMPLE EVENT" to see whats in `event`
const fetch = require('node-fetch')
import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
var _ = require('lodash')

const oneSignalUrl = process.env['ONE_SIGNAL_URL']
const oneSignalApiKey = process.env['ONE_SIGNAL_API_KEY']
const oneSignalAppId = process.env['ONE_SIGNAL_APP_ID']

module.exports = async (event) => {
  const senderName = event.data.Message.node.sender.name
  const message = "New message from " + senderName
  const receiverOneSignalId = event.data.Message.node.receiver.oneSignalPlayerId
  const notifyMessages = event.data.Message.node.receiver.notifyMessages

  const receiverId = event.data.Message.node.receiver.id
  const senderId = event.data.Message.node.sender.id
  
  if(notifyMessages) {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')
    const target = await getVoteId(api, receiverId, senderId)

    const targetId = target.allVotes[0].id
      fetch(oneSignalUrl, {
         method: 'POST',
         body: JSON.stringify({
         app_id: oneSignalAppId,
         contents: {"en": message},
         include_player_ids: [receiverOneSignalId],
         data: {
           source: "chat",
           match: {
            id: targetId,
             target: {
                id: event.data.Message.node.sender.id,
                name: event.data.Message.node.sender.name,
                averageAge: event.data.Message.node.sender.averageAge
             }
           }
         }
     }),
     headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic "+oneSignalApiKey
     }
   })
   .then(res => res.json())
   .then(data => {
    console.log("RESPONSE", data)
   }).catch(err => {
    console.log("ERROR", err)
   })
  }
  return {data: event.data}
}

async function getVoteId(api, userId, targetId) {
  const query = `
  query getVoteId($userId: ID!, $targetId: ID!) {
    allVotes(filter: {
      AND: {
        user: {
          id: $userId
        },
        target: {
          id: $targetId
        }
      }
    }) {
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
