import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fileSaver from "file-saver";

import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const Home = () => {
  const [sounds, setSounds] = useState();

  // const fetchRandomSounds = () => {

  //   axios({
  //     method: 'GET',
  //     url: `${process.env.REACT_APP_API_DOMAIN}/randomSound`,
  //     responseType: 'blob',
  //     params: {
  //       count: 10
  //     }
  //   }).then(res => {
  //     console.log(res.data);
  //     var blob = new Blob([res.data], {type: "application/zip"});
  //     fileSaver.saveAs(blob, "samples.zip")
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }

  const fetchRandomSounds = () => {

    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_DOMAIN}/randomSound`,
      params: {
        count: 10
      }
    }).then(res => {
      console.log(res.data);
      setSounds(res.data);
    }).catch(err => {
      console.log(err);
    });
  }

  const download = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_DOMAIN}/download`,
      responseType: 'blob',
      params: {
        sounds: sounds
      }
    }).then(res => {
      console.log(res.data);
      var blob = new Blob([res.data], {type: "application/zip"});
      fileSaver.saveAs(blob, "samples.zip")
    }).catch(err => {
      console.log(err);
    });
  }

  return(
    <div style={{textAlign: "center"}}>
      <h1>Get Sounds!</h1>
      <Button type="primary" shape="round" icon={<DownloadOutlined />} size="large" onClick={download}>
        Download
      </Button>
      <Button type="primary" shape="round" icon={<DownloadOutlined />} size="large" onClick={fetchRandomSounds}>
        Fetch
      </Button>
    </div>
  );
}

export default Home;