const functions = require("firebase-functions");
const axios = require("axios");
const AdmZip = require('adm-zip');
require('dotenv').config();

exports.downloadZip = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "2GB"
  })
  .https.onRequest(async (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
  
    // add error handling
    if (request.query.sounds === undefined) {
      response.error("No sound objects")
    }
  
    const zip = new AdmZip();
    console.log(request.query.sounds)
    const data = JSON.parse(request.query.sounds);
  
    for (var index in data) {
      sound = data[index];
  
      await axios({
        method: 'GET',
        url: sound.mp3link,
        responseType: 'arraybuffer',
      }).then(res => {
        functions.logger.info("Archiving:", sound.name);
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