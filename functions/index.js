const functions = require("firebase-functions");
const axios = require("axios");
require('dotenv').config();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// sound_id's start from 6, goes past 600000
// something like this
// https://freesound.org/apiv2/search/text/?query=&token={{client_secret}}&sort=created_desc
// to approximate max id, then generate random IDS between min and max id
// query the sound instances endpoint until we get enough data

exports.search = functions.https.onRequest(async (request, response) => {
  
  const searchResults = await axios({
    method: 'GET',
    url: `https://freesound.org/apiv2/search/text/`,
    params: {
      query: "",
      token: process.env.CLIENT_SECRET
    }
  }).then(res => {
    // console.log(res.data)
    functions.logger.info("Returning search data for query ", request.query, {structuredData: true})
    return res.data;
  }).catch((err) => {
    console.log(err);
    functions.logger.error(err, {structuredData: true});
  })

  console.log(request.query);
  functions.logger.info("Hello logs!", {structuredData: true});
  
  response.send(searchResults);
});

exports.randomSoundPreviews = functions.https.onRequest(async (request, response) => {
  var min = 6;
  var max = 601000;

  var count = request.query.count;

  var soundInstances = {};
  var sounds = [];
  soundInstances.sounds = sounds;

  var randomIDs = [];

  while (Object.keys(soundInstances.sounds).length < count) {
    var rand = Math.floor(Math.random() * (max - min + 1) + min)

    // Generate unique random number
    if (Object.keys(soundInstances.sounds).length > 1 ) {
      while (rand in randomIDs) {
        rand = Math.floor(Math.random() * (max - min + 1) + min)
      }
    }

    const sound = await axios({
      method: 'GET',
      url: `https://freesound.org/apiv2/sounds/${rand}/`,
      params: {
        token: process.env.CLIENT_SECRET
      }
    }).then(res => {
      var id = res.data.id;

      soundInstances.sounds.push({
        id: res.data.id,
        name: res.data.name,
        duration: res.data.duration,
        link: res.data.previews['preview-hq-mp3'],
        image: res.data.images['waveform_m'],
      });

      console.log("name:", res.data.name);
      console.log("id:", res.data.id);
      
      randomIDs.push(res.data.id);
      return;
    }).catch(err => {
      console.log(err.message)
    })
  }

  console.log(soundInstances);
  

  response.send(soundInstances);
});
