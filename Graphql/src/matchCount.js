'use latest'
const { fromEvent } = require('graphcool-lib')
function getMatchCount(data){
    let list = data.allVotes
    let hashMap = {}
    let count = 0
    for (var i = 0; i< list.length; i++){
        let obj = list[i]
        let temp = [obj.user.id, obj.target.id]
        temp.sort()
        let uniqueKey = temp[0] + temp[1]
        if(hashMap.hasOwnProperty(uniqueKey)){
            count++
        }
        else{
            hashMap[uniqueKey] = true
        }
    }
    return count
} 

module.exports = (event) => {
  const api = fromEvent(event).api("simple/v1")
  const query = `
    query{
      allVotes(filter:{isLiked: true}){
        user {
          id
        }
        target {
          id
        }
      }
    }
  `
  return api.request(query)
    .then(data => {
      let count = getMatchCount(data)  
      return {
        data: {
          count: count,
        }
      }
    })
    .catch(err => {
      return {
        data: {
          error: true
        }
      }
    })
}
          
