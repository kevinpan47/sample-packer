import React, {useEffect, useState, useRef} from 'react'
import { ReactP5Wrapper } from 'react-p5-wrapper';
import '../styles/index.css';

import ToneTest from './ToneTest';

import "./globals";
import "p5/lib/addons/p5.sound";
import * as p5 from 'p5';


const P5Test = () => {
  const sliderValue = useRef(1);

  const mountRef = useRef(null);

  var sampler;
  const testLink = "https://freesound.org/data/previews/191/191053_177850-hq.mp3"
  
  

  var fft;
  var song;

  const sketch = p => {
    p.preload = () => {
      song = p.loadSound('https://freesound.org/data/previews/339/339385_4509539-hq.mp3')
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      fft = new p5.FFT(0.9, 1024)
    }
  
    p.draw = () => {
      p.background(209, 213, 219);
      p.stroke(255)
      p.noFill()

      var wave = fft.waveform();

      p.beginShape()
      for (var i = 0; i < p.windowWidth; i++) {
        var index = Math.floor(p.map(i, 0, p.windowWidth, 0, wave.length))
        var x = i
        var y = wave[index] * 500 + p.windowHeight / 2
        p.vertex(x, y)
      }
      p.endShape()
    };

    p.mouseClicked = () => {
      if (song.isPlaying()) {
        song.pause()
      } else {
        song.play()
      }
    }
  }

  return (
    <div>
      <div className="absolute">
        <ReactP5Wrapper sketch={sketch} />
      </div>
    </div>
  )

}

export default P5Test