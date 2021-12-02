const functions = require("firebase-functions");
const axios = require("axios");
const AdmZip = require('adm-zip');
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
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

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

exports.randomSound = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "1GB",
  })
  .https.onRequest(async (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    functions.logger.info("Called /randomSoundPreviews");

    var min = 6;
    var max = 601000;

    var count = request.query.count;
    functions.logger.info("Count:", count);

    var soundInstances = {};
    var sounds = [];
    soundInstances.sounds = sounds;

    var randomIDs = [];
    var zip = new AdmZip();

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
      }).then(async res => {
        var sound = {
          id: res.data.id,
          name: res.data.name,
          duration: res.data.duration,
          link: res.data.previews['preview-hq-mp3'],
          image: res.data.images['waveform_m'],
        }

        functions.logger.info("Retrieving sound:");
        functions.logger.info(sound);

        // response.write(JSON.stringify(sound))

        var fileName = sound.name.replace('/', '_')
        if (sound.name.lastIndexOf('.') != -1) {
          fileName = sound.name.substring(0, sound.name.lastIndexOf('.'));
        }
        fileName += '-' + sound.id + '.mp3'
        
        soundInstances.sounds.push(sound);
        randomIDs.push(sound.id);

      }).catch(err => {
        functions.logger.error(err.message);
        functions.logger.info("Retrying with different sound ID");
      })
    }

    // var zipFileContents = zip.toBuffer();

    // const fileName = 'sounds.zip';
    // const fileType = 'application/zip';

    // response.writeHead(200, {
    //     'Content-Disposition': `attachment; filename="${fileName}"`,
    //     'Content-Type': fileType,
    // })

    // response.end(zipFileContents);

    response.send(soundInstances);
    // response.end()
});

exports.download = functions.https.onRequest(async (request, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  // add error handling
  if (request.query.sounds === undefined) {
    response.error("No sound objects")
  }

  const zip = new AdmZip();
  const data = JSON.parse(request.query.sounds);

  for (var index in data.sounds) {
    sound = data.sounds[index];

    await axios({
      method: 'GET',
      url: sound.link,
      responseType: 'arraybuffer',
    }).then(res => {
      zip.addFile(sound.name, Buffer.from(res.data));
    }).catch(err => {
      functions.logger.error(err.message);
    });
  }
  
  var zipFileContents = zip.toBuffer();

  const fileName = 'sounds.zip';
  const fileType = 'application/zip';

  response.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
  })

  response.end(zipFileContents);
});