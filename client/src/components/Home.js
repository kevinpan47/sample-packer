import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fileSaver from "file-saver";
// import { Blob } from 'buffer';


const Home = () => {
  const [sounds, setSounds] = useState();

  useEffect(() => {
  }, []);

  const fetchRandomSounds = () => {
    axios({
      method: 'GET',
      url: `http://localhost:5001/sample-packer/us-central1/randomSoundPreviews`,
      params: {
        count: 10
      }
    }).then(res => {
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    });
  }

  const downloadZip = () => {
    axios({
      method: 'GET',
      url: `http://localhost:5001/sample-packer/us-central1/download`,
      responseType: 'blob'
    }).then(res => {
      console.log(res.data);
      var blob = new Blob([res.data], {type: "application/zip"});
      fileSaver.saveAs(blob, "hello.zip")
    }).catch(err => {
      console.log(err);
    });
  }

  return(
    <>
      <button onClick={fetchRandomSounds}>
        Get Sounds!
      </button>
      <button onClick={downloadZip}>
        Download sounds!
      </button>
    </>
  );
}

export default Home;