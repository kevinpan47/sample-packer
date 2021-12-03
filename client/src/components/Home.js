import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fileSaver from "file-saver";
import SoundCard from './SoundCard';
import '../styles/index.css';

const Home = () => {
  const [sounds, setSounds] = useState();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [downloading, setDownloading] = useState(true);

  const fetchRandomSounds = () => {
    setSounds(null);
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_DOMAIN}/randomSearch`,
      params: {
        count: 10
      }
    }).then(res => {
      console.log(res.data);
      setSounds(res.data.sounds);
    }).catch(err => {
      console.log(err);
    });
  }

  const download = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_DOMAIN}/downloadZip`,
      responseType: 'blob',
      params: {
        sounds: sounds
      }
    }).then(res => {
      console.log(res.data);
      var sounds = new Blob([res.data], {type: "application/zip"});
      fileSaver.saveAs(sounds, "samples.zip")
    }).catch(err => {
      console.log(err);
    });
  }

  const renderSounds = () => {
    var list = []
    for (var index in sounds) {
      // console.log)
      list.push(
        <>
          <SoundCard sound={sounds[index]}/>
          <br/>
        </>
      );
    }

    return list;
  }

  return(
    <div className="container">
      <div className="align-center">
        <h1>Get Sounds!</h1>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={download}
        >
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>Download</span>
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={fetchRandomSounds}
        >
          <div className="animate-spin h-5 w-5 mr-3 rounded-full"></div>
          Fetch
        </button>
        {renderSounds()}
      </div>
    </div>
  );
}

export default Home;