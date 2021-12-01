const functions = require("firebase-functions");
const axios = require("axios");
const archiver = require('archiver');
const https = require('https');
const fs = require('fs');
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
    functions.logger.info("Returning search data for query ", request.query, {structuredData: true})
    return res.data;
  }).catch((err) => {
    functions.logger.error(err.message);
  })

  console.log(request.query);
  functions.logger.info("Hello logs!");
  
  response.send(searchResults);
});

exports.randomSoundPreviews = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Called /randomSoundPreviews");

  var min = 6;
  var max = 601000;

  var count = request.query.count;
  functions.logger.info("Count:", count);

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

    await axios({
      method: 'GET',
      url: `https://freesound.org/apiv2/sounds/${rand}/`,
      params: {
        token: process.env.CLIENT_SECRET
      }
    }).then(res => {
      var sound = {
        id: res.data.id,
        name: res.data.name,
        duration: res.data.duration,
        link: res.data.previews['preview-hq-mp3'],
        image: res.data.images['waveform_m'],
      }

      soundInstances.sounds.push(sound);

      functions.logger.info("Retrieving sound:");
      functions.logger.info(sound);
      
      randomIDs.push(res.data.id);
      return;
    }).catch(err => {
      functions.logger.error(err.message);
      functions.logger.info("Retrying with different sound ID");
    })
  }
  
  response.send(soundInstances);
});

const archiveFiles = (response) => {
  var archive = archiver('zip');

  archive.on('error', function(err) {
    response.status(500).send({error: err.message});
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  response.attachment('samples.zip');

  //this is the streaming magic
  archive.pipe(response);

  archive.directory(__dirname + '/sounds', false);

  archive.finalize();

}

exports.download = functions.https.onRequest(async (request, response) => {

  const file = fs.createWriteStream("./sounds/file.mp3");
  https.get("https://freesound.org/data/previews/215/215601_1979597-hq.mp3", function(res) {
    var stream = res.pipe(file);
    stream.on('finish', () => {
      archiveFiles(response);
    });
  });

});