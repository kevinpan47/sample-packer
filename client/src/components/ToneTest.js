import React, {useEffect, useState, useRef} from 'react'
import * as Tone from 'tone'
import { ReactP5Wrapper } from 'react-p5-wrapper';
import '../styles/index.css';

import "./globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";


const ToneTest = () => {
  const sliderValue = useRef(1);

  const mountRef = useRef(null);
  
  // const synth = new Tone.MembraneSynth().toDestination()
  
  const testLink = "https://freesound.org/data/previews/191/191053_177850-hq.mp3"
  
  // // Effects
  // const filter = new Tone.Filter(1500, "lowpass").toDestination()
  // const reverb = new Tone.Reverb(100).toDestination()

  // const fft = new Tone.FFT(256).toDestination()

  // const sampler = new Tone.Sampler({
  //   urls: {
  //     A4: testLink
  //   },
  // })

  // const addEffect = () => {
  //   sampler.connect(reverb)
  //   console.log(sampler)
  // }

  // const handleEffectChange = async (e) => {
  //   e.preventDefault()
  //   sliderValue.current = e.target.value
  //   reverb.set({
  //     wet: e.target.value
  //   })
  //   // await reverb.ready
  //   // console.log(sliderValue)
  // }

  // const playSound = () => {
  //   if (sampler.loaded) {
  //     sampler.triggerAttack("A4")
  //   }
  // }

  // const stopSound = () => {
  //   sampler.releaseAll()
  // }

  var fft;
  var song;

  const sketch = p => {
    p.preload = () => {
      song = p.loadSound(testLink)
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      fft = new p5.FFT()
      setTimeout(2, () => song.play())
    }
  
    p.draw = () => {
      p.background(0);
      p.stroke(255)

      var wave = fft.waveform();

      for (var i = 0; i < p.windowWidth; i++) {
        var index = Math.floor(p.map(i, 0, p.windowWidth, 0, wave.length))
        var x = i
        var y = wave[index] * 300 + p.windowHeight / 2
        p.point(x, y)
      }
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
        {/* <button className="bg-green-500 w-32 h-16 text-white text-2xl" onClick={() => playSound()}>play</button>
        <button className="bg-red-500 w-32 h-16 text-white text-2xl" onClick={() => stopSound()}>stop</button>
        <div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            orient="vertical"
            // defaultValue={sliderValue}
            onChange={handleEffectChange}/>
            <button className="bg-yellow-200" onClick={_ => addEffect()}>toggleReverb</button>
        </div> */}
        <ReactP5Wrapper sketch={sketch} />
      </div>
    </div>
  )

}

export default ToneTest