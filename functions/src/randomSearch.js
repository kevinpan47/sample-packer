const functions = require("firebase-functions");
const axios = require("axios");
require('dotenv').config();

exports.randomSearch = functions
  .runWith({
    timeoutSeconds: 300,
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
          url: res.data.url,
          duration: res.data.duration,
          mp3link: res.data.previews['preview-hq-mp3'],
          image: res.data.images['waveform_m'],
        }

        functions.logger.info("Retrieving sound:", sound.name);

        var fileName = sound.name.replace('/', '_')
        if (sound.name.lastIndexOf('.') != -1) {
          fileName = sound.name.substring(0, sound.name.lastIndexOf('.'));
        }
        fileName += '-' + sound.id + '.mp3'
        
        soundInstances.sounds.push(sound);
        randomIDs.push(sound.id);

        if (randomIDs.length > count * 3) {
          response.error("There was an error fetching sounds")
        }
      }).catch(err => {
        functions.logger.error(err.message);
        functions.logger.info("Retrying with different sound ID");
      })
    }

    response.send(soundInstances);
});