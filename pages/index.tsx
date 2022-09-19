import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Overworld from '../components/Overworld.js';
import GameObject from '../components/GameObject.js';
import Maps from '../components/Maps.js'

const Home: NextPage = () => {
  useEffect(() => {
    init()
  }, [])
  
  function init() {
    Maps()
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
    });
    overworld.init();
  };

  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className='game-container relative'>
          <canvas className='game-canvas' width={"352"} height={"198"}></canvas>
          <div id="position" className='absolute bottom-0 right-0 text-white'>(x,y)</div>
        </div>
      </main>
    </div>
  )
}
export default Home
