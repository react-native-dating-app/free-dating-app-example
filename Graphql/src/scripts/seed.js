const { GraphQLClient } = require('graphql-request')

const ENDPOINT = 'https://api.graph.cool/simple/v1/YOUR_PROJECT_ID'

const client = new GraphQLClient(ENDPOINT)

const signInUserMutation = `mutation {
  signupUser(
    name: "Admin",
    email: "admin@datingapp.com",
    password: "Password",
    firstName: "Admin",
    lastName: "",
    gender: "Male",
    deviceId: "NKJH997NI"
    devicePlatform: "Ios",
    latitude: 12.32323,
    longitude: 22.3434,
    role: "Admin"
  ) {
    id
  }
}`

const createSettingMutation = `mutation {
    createSetting(
        googlePlayStoreLink: "https://play.google.com/store/apps",
        iosAppStoreLink: "https://itunes.apple.com/us/genre/ios/id36?mt=8",
        timezone: "America/Whitehouse"
    ) {
        id
    }
}`

client.request(signInUserMutation)
  .then(data => {
    client.request(createSettingMutation).then((data) => {
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
  })
  .catch(err => (
    console.log(err)
  ))