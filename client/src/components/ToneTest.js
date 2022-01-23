import React, {useEffect, useState, useRef} from 'react'
import * as Tone from 'tone';
import '../styles/index.css';

const ToneTest = () => {
	const sliderValue = useRef(1);
	const synth = new Tone.MembraneSynth().toDestination();
  const testLink = "https://freesound.org/data/previews/191/191053_177850-hq.mp3"

	const sampler = new Tone.Sampler({
		urls: {
			A4: testLink
		},
	}).toDestination()
  
  // Effects
  const filter = new Tone.Filter(1500, "lowpass").toDestination()
  const reverb = new Tone.Reverb(100).toDestination()

  const fft = new Tone.FFT(256).toDestination()

  const addEffect = () => {
    sampler.connect(reverb)
    console.log(sampler)
  }

  const handleEffectChange = async (e) => {
    e.preventDefault()
    sliderValue.current = e.target.value
    reverb.set({
      wet: e.target.value
    })
    // await reverb.ready
    // console.log(sliderValue)
  }

  const playSound = () => {
    if (sampler.loaded) {
      sampler.triggerAttack("A4")
    }
  }

  const stopSound = () => {
    sampler.releaseAll()
  }

	return (
		<div>
			<button className="bg-green-500 w-32 h-16 text-white text-2xl" onClick={() => playSound()}>play</button>
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
			</div>
		</div>
	)
}

export default ToneTest