import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fileSaver from "file-saver";
import SoundCard from './SoundCard';
import SoundCard2 from './SoundCard2';
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

  const deleteSound = (id) => {
    var newSounds = [...sounds];
    for (var i in newSounds) {
      console.log(id)
      if (newSounds[i].id == id) {
        newSounds.splice(i, 1);
        break;
      }
    }
    console.log(i);
    console.log(newSounds);
    setSounds(newSounds);
  }

  const renderSounds = () => {
    var list = []
    for (var index in sounds) {
      // console.log)
      list.push(
        <>
          <SoundCard2 sound={sounds[index]} delete={(id) => deleteSound(id)}/>
        </>
      );
    }

    return list;
  }

  return(
    <div className="bg-gray-300 px-12 h-full min-h-screen">
      <div className="w-screen">
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
      </div>
      <br />
      <div className="box-border grid-cols-1 sm:grid-cols-1 md:mx-auto md:masonry-2-col lg:masonry-2-col xl:masonry-3-col gap-5">
          {renderSounds()}
        </div>
    </div>
  );
}

export default Home;