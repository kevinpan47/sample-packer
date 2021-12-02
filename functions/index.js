const functions = require("firebase-functions");
const axios = require("axios");
const archiver = require('archiver');
const https = require('https');
const fs = require('fs');
const fsExtra = require('fs-extra');
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

exports.randomSoundPreviews = functions.https.onRequest(async (request, response) => {
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
        duration: res.data.duration,
        link: res.data.previews['preview-hq-mp3'],
        image: res.data.images['waveform_m'],
      }

      soundInstances.sounds.push(sound);

      functions.logger.info("Retrieving sound:");
      functions.logger.info(sound);

      var fileName = sound.name.replace('/', '_')
      if (sound.name.lastIndexOf('.') != -1) {
        fileName = sound.name.substring(0, sound.name.lastIndexOf('.'));
      }

      await downloadFile(sound.link, `./sounds/${fileName}-${sound.id}.mp3`)
      
      randomIDs.push(res.data.id);
      return;
    }).catch(err => {
      functions.logger.error(err.message);
      functions.logger.info("Retrying with different sound ID");
    })
  }

  response.send(soundInstances);
});

const archiveFiles = async (zipName) => {
  const output = fs.createWriteStream(`${__dirname}/zip/${zipName}.zip`);
  var archive = archiver('zip');
  archive.on('error', function(err) {
    console.log("Archiver error:", err.message);
  });
  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
    fsExtra.emptyDirSync(`${__dirname}/sounds`);
  });
  // output.attachment('samples.zip');
  archive.pipe(output);
  archive.directory(__dirname + '/sounds', false);
  await archive.finalize()
}

const downloadFile = async (fileUrl, outputLocationPath) => {
  const file = fs.createWriteStream(outputLocationPath);
  return axios({
    method: 'GET',
    url: fileUrl,
    responseType: 'stream',
  }).then(response => {
    return new Promise((resolve, reject) => {
      response.data.pipe(file);
      let error = null;
      file.on('error', err => {
        error = err;
        file.close();
        reject(err);
      });
      file.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  });
}

exports.download = functions.https.onRequest(async (request, response) => {
  response.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  });

  // await archiveFiles("archive");
  // response.download('./zip/archive.zip')
  var zip = new AdmZip();

  zip.addLocalFile("./sounds/FAT_Vocals-252372.mp3");
  var zipFileContents = zip.toBuffer();
  
  const fileName = 'uploads.zip';
  const fileType = 'application/zip';

  response.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
  })
  return response.end(zipFileContents)
});