import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Overworld from '../components/Overworld.js';

const Home: NextPage = () => {
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    init()
  }, [])
  
  function init() {
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
        <div className='game-container'>
          <canvas className='game-canvas' width={"352"} height={"198"}></canvas>
        </div>
      </main>
    </div>
  )
}

export default Home
