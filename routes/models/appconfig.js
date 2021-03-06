//npm run app
module.exports = {
  node_version: "8.6.0",
  mongodb_version: "3.4.10",
  infoLivrare: "not",
  database: 'pharma',
  appName: "Etix Comenzi",
  developer: true,
  rolls: ['root', 'admin', 'power', 'normal', 'restricted'],
  // admin = cel care face comenzi, power= cel care introduce necesar, normal = altii care au acces
  rol:{
    root: [],
    admin:["cui"],
    power:["cui"],
    normal:["cui","pl"],
    restricted:["_id"],
  },
  emailSubject: this.appName + "send you a message",
  user_model: {
    cui: "0000",
    pl:"pl",
    client:"client",
    name:"name",
    surmane:"surname",
    email:"email",
    password:"password",
    rights:"root"
  },
  url: 'url',

};