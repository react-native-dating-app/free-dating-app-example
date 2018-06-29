'use latest'

const { fromEvent } = require('graphcool-lib')

const deg2rad = deg => {
  return deg * (Math.PI / 180)
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371 // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1) // deg2rad below
  var dLon = deg2rad(lon2 - lon1)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c // Distance in km
  return d
}
module.exports = (event) => {
  const userId = event.data.userId;
  const showMe = event.data.showMe;
  const minAge = event.data.minAge;
  const maxAge = event.data.maxAge;
  const userLat = event.data.latitude;
  const userLon = event.data.longitude;
  const distance = event.data.distance;
  const count = event.data.count;
  
  event.context = Object.assign({}, event.context, {
    graphcool: {
      projectId: event.context.graphcool.projectId,
      // rootToken: (event.headers && event.headers.Authorization) ? event.headers.Authorization.replace("Bearer ", "") : null
      rootToken: event.context.auth ? event.context.auth.token : null
    }
  })
  const api = fromEvent(event).api("simple/v1")
  const query = `
    query allUsers(
    $userId: ID!
    $showMe: Gender
    $minAge: Float
    $maxAge: Float
  ) {
    allUsers(
      filter: {
        AND: [
          { id_not: $userId }
          { targetedBy_every: { user: { id_not: $userId } } }
          { active: true }
          { deleted: false }
          { discoverablity: true }
          { gender: $showMe }
          { averageAge_gt: $minAge }
          { averageAge_lt: $maxAge }
		  { role: User }
        ]
      }
    ) {
      id
      name
      profilePicture
      averageAge
      longitude
      latitude
      jobTitle
      worksAt
      instagram
      instaPictures
      instaUserName
      interests {
        name
        id
      }
    }
  }
  `
  // gghgjg
  return api.request(query, {
    userId,
    showMe,
    minAge,
    maxAge,
  })
    .then(data => {
       let filteredUsers = [];
      // Filter out the users on based on location
      const allUsers = data ? data.allUsers || [] : [];
       allUsers.every((user) => {
        if(filteredUsers.length === count) {
          return false;
        }
        if(getDistanceFromLatLonInKm(userLat, userLon, user.latitude, user.longitude) <= distance) {
          filteredUsers.push(user)
        }
        return true;
      })
      return {
        data: {
          success: true,
          allUsers: filteredUsers,
          event
        }
      }
    })
    .catch(err => {
      return {
        data: {
          success: false,
          errors: err.response.errors,
          event
        }
      }
    })
}