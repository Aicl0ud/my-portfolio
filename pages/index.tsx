import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Overworld from '../components/Overworld.js';
import GameObject from '../components/GameObject.js';

const Home: NextPage = () => {
  useEffect(() => {
    init()
  }, [])
  
  function init() {
    window.OverworldMaps = {
      DemoRoom: {
        lowerSrc: "/images/maps/main/Main.gif",
        upperSrc: "/images/maps/main/Main.gif",
        gameObjects: {
          hero: new GameObject({
            x: 5,
            y: 6,
          }),
          npc1: new GameObject({
            x: 7,
            y: 9,
            src: "/images/characters/player/mPlayer_[human].png",
          }),
        },
      },
    };
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
