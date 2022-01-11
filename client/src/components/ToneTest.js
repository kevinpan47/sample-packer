import React, {useEffect, useState, useRef} from 'react'
import * as Tone from 'tone'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import '../styles/index.css';

const ToneTest = () => {
  const mountRef = useRef(null);
  
  const synth = new Tone.MembraneSynth().toDestination()
  
  const testLink = "https://freesound.org/data/previews/191/191053_177850-hq.mp3"
  
  // Effects
  const filter = new Tone.Filter(1500, "lowpass").toDestination()
  const reverb = new Tone.Reverb(10).toDestination()

  const fft = new Tone.FFT(256).toDestination()

  const sampler = new Tone.Sampler({
    urls: {
      A4: testLink
    },
  }).chain(fft, filter)

  const playSound = () => {
    sampler.triggerAttack("A4")
  }

  useEffect(() => {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight - 64 );
    mountRef.current.appendChild( renderer.domElement );
    
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;

    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper)

    const controls = new OrbitControls( camera, renderer.domElement );
    
    var animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      // console.log(fft.getValue())
      controls.update();
      
      renderer.render( scene, camera );
    };

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => mountRef.current.removeChild( renderer.domElement);
  })

  return(
    <div className="absolute">
      <div ref={mountRef}>
        <div>
          <button className="bg-green-500 w-32 h-16 text-white text-2xl" onClick={() => playSound()}>play</button>
          <button className="bg-red-500 w-32 h-16 text-white text-2xl" onClick={() => playSound()}>test</button>
        </div>
      </div>
    </div>
  )

}

export default ToneTest