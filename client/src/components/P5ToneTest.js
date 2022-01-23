import React, {useEffect, useState, useRef} from 'react'
import { ReactP5Wrapper } from 'react-p5-wrapper';
import '../styles/index.css';
import * as Tone from 'tone';

const P5ToneTest = () => {
  const sliderValue = useRef(1);

  const mountRef = useRef(null);

  const testLink = "https://freesound.org/data/previews/339/339385_4509539-hq.mp3"
  // const testLink = '../../public/Alina Baraz, Galimatias Fantasy.wav'
  
  const fft = new Tone.FFT(2048).toDestination()

  // const noise = new Tone.Noise("white").connect(fft);

  const sampler = new Tone.Player(testLink).connect(fft);

  var song;
  var space_between_lines;

  const playSound = () => {
    if (sampler.loaded) {
      sampler.start()
      // console.log(fft)
    } else {
      console.log("not loaded")
    }
  }

  const stopSound = () => {
    sampler.stop()
  }

  const sketch = p => {
    p.preload = () => {
      
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight - 64);
      space_between_lines = p.width / 256;
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight - 64);
    }
  
    p.draw = () => {
      p.background(209, 213, 219);
      p.stroke(255)
      p.noFill()

      var db = fft.getValue()

      const wave = db.map((val) => {
        // console.log(val)
        if (val == Number.NEGATIVE_INFINITY) {
          return 0;
        } else {
          return Math.pow(1.5, (val / 20));
        }
      })

      // console.log(wave)

      for (let i = 0; i < wave.length; i++) {
        p.fill(i,255,255);
        let amp = wave[i]
        let y = p.map(amp, 0, 1, p.height, 0);
        p.rect(i * space_between_lines, y, space_between_lines, p.height - y);
      }
    };
  }

  return (
    <div>
      <div className="absolute">
        <button className="bg-green-500 w-32 h-16 text-white text-2xl" onClick={() => playSound()}>play</button>
        <button className="bg-red-500 w-32 h-16 text-white text-2xl" onClick={() => stopSound()}>stop</button>
        <ReactP5Wrapper sketch={sketch} />
      </div>
    </div>
  )

}

export default P5ToneTest