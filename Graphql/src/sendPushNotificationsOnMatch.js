// Click "EXAMPLE EVENT" to see whats in `event`
const fetch = require('node-fetch')
var _ = require('lodash')
const oneSignalUrl = process.env['ONE_SIGNAL_URL']
const oneSignalApiKey = process.env['ONE_SIGNAL_API_KEY']
const oneSignalAppId = process.env['ONE_SIGNAL_APP_ID']
const message =  "Congratulations! You have a new match"
                
module.exports = function (event) {
  const userId = event.data.Vote.node.user.id
  const isTargetLikedByUser = event.data.Vote.node.isLiked
  if(isTargetLikedByUser) {
    const targets = event.data.Vote.node.target.targets
    const isUserExist = _.find(targets, (Target) => Target.target.id === userId)
    const targetOneSignalId = event.data.Vote.node.target.oneSignalPlayerId
    const notifyMatches = event.data.Vote.node.target.notifyMatches
    if(notifyMatches && isUserExist && isUserExist.isLiked) {
       // A match is created successfully
      fetch(oneSignalUrl, {
         method: 'POST',
         body: JSON.stringify({
         app_id: oneSignalAppId,
         contents: {"en": message},
         include_player_ids: [targetOneSignalId],
         data: {source: "message"}
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
  }
  return {data: event.data}
}

