import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fileSaver from "file-saver";

import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const Home = () => {
  const [sounds, setSounds] = useState();

  const fetchRandomSounds = () => {
    axios({
      method: 'GET',
      url: `https://us-central1-sample-packer.cloudfunctions.net/randomSound`,
      responseType: 'blob',
      params: {
        count: 10
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
      <Button type="primary" shape="round" icon={<DownloadOutlined />} size="large" onClick={fetchRandomSounds}>
        Download
      </Button>
    </div>
  );
}

export default Home;