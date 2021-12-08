import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fileSaver from "file-saver";
import SoundCard from './SoundCard';
import SoundCard2 from './SoundCard2';
import '../styles/index.css';
import FetchForm from './FetchForm';

const Home = () => {
  const [sounds, setSounds] = useState();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showFetchForm, setShowFetchForm] = useState(true);

  const fetchRandomSounds = (count) => {
    setSounds(null);
    setFetchLoading(true);
    setShowFetchForm(false);
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_DOMAIN}/randomSearch`,
      params: {
        count: count
      }
    }).then(res => {
      console.log(res.data);
      setSounds(res.data.sounds);
      setFetchLoading(false);
    }).catch(err => {
      console.log(err);
    });
  }

  const download = () => {
    setDownloading(true);
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_DOMAIN}/downloadZip`,
      responseType: 'blob',
      params: {
        sounds: JSON.stringify(sounds)
      }
    }).then(res => {
      console.log(res.data);
      var sounds = new Blob([res.data], {type: "application/zip"});
      fileSaver.saveAs(sounds, "samples.zip");
      setDownloading(false)
    }).catch(err => {
      console.log(err);
    });
  }

  const reset = () => {
    setSounds(null);
    setShowFetchForm(true);
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
    <div className="bg-gray-300 h-full min-h-screen w-screen">
      <div>
        {showFetchForm ? (
          <FetchForm
            fetch={(count) => fetchRandomSounds(count)}
          />
        ) : (
          fetchLoading ? (
            <div className="h-screen w-full flex justify-center items-center">
              <div
                style={{borderTopColor: 'transparent'}}
                className="w-16 h-16 border-8 border-gray-800 border-solid rounded-full animate-spin"
              ></div>
            </div>
          ) : (
            <div className="pt-10">
              <div className="box-border grid-cols-1 sm:grid-cols-1 md:mx-auto md:masonry-2-col lg:masonry-2-col xl:masonry-3-col gap-5 px-12">
                {renderSounds()}
              </div>
              <div className="justify-center w-full inline-flex py-10 text-3xl">
                <button
                  className={`mx-4 text-white bg-gray-600 transition disabled:opacity-50 duration-300 ease-in-out transform ${!downloading && "hover:bg-green-500 hover:scale-110 hover:translate-y-1"} font-bold py-2 px-4 rounded inline-flex items-center`}
                  onClick={download}
                  disabled={downloading}
                >
                  {
                    downloading ?
                      <div
                        style={{borderTopColor: 'transparent'}}
                        className="w-8 h-8 border-4 border-gray-800 border-solid rounded-full animate-spin"
                      >
                      </div>
                    :
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="pl-2">Download</span>
                      </>
                  }
                </button>
                {
                  !downloading &&
                    <button
                      className="mx-4 text-white bg-gray-600 transition duration-300 ease-in-out transform hover:translate-y-1 hover:bg-red-500 hover:scale-110 font-bold py-2 px-4 rounded inline-flex items-center"
                      onClick={reset}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="pl-2">Clear Search</span>
                    </button>
                }
              </div>
            </div>
          )
        )}
        
      </div>
    </div>
  );
}

export default Home;