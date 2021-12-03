const functions = require("firebase-functions");
const axios = require("axios");
require('dotenv').config();

const download = require('./src/downloadZip');
const random = require('./src/randomSearch');

exports.downloadZip = download.downloadZip;
exports.randomSearch = random.randomSearch;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// sound_id's start from 6, goes past 600000
// something like this
// https://freesound.org/apiv2/search/text/?query=&token={{client_secret}}&sort=created_desc
// to approximate max id, then generate random IDS between min and max id
// query the sound instances endpoint until we get enough data