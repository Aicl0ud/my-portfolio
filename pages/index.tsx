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

  // About me
  // Skill
  // Links
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className='game-container relative'>
          <canvas className='game-canvas bg-[#353540]' width={"352"} height={"198"}></canvas>
          <div id="position" className='absolute bottom-0 right-0 mr-1 text-white'>(x,y)</div>
          

            <div className='box red-box hidden'>
              <div className='content'>
                <div className='absolute top-0 right-0 font-bold text-red-600 cursor-pointer' onClick={(e)=>{(document.querySelector('.box') as Element).classList.add('hidden')}}>X</div>
                <div className='title'>About me</div>
                <p>
                  24 yo | Software Developer | Love to study new things | Interested in blockchain and investment | Familiar with javascript | Javascript is an art 👨‍🎨 🎨
                </p>
              </div>
            </div>

          
        </div>
      </main>
    </div>
  )
}
export default Home
