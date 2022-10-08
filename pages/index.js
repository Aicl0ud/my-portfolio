import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Overworld from "../components/Overworld.js";
import GameObject from "../components/GameObject.js";
import Maps from "../components/Maps.js";
import Keyboard from "../components/Keyboard.js";

const Index = () => {
  useEffect(() => {
    init();
  }, []);

  function init() {
    Maps();
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
    });
    overworld.init();
  }

  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="game-container relative">
          <canvas
            className="game-canvas bg-[#353540]"
            width={"320"}
            height={"180"}
          ></canvas>
          <div
            id="position"
            className="absolute bottom-0 right-0 mr-1 text-white"
          ></div>

          <div className="box wooden transition transition-all duration-500">
            <div className="content">
              <div
                className="absolute top-0 right-0 font-bold text-red-600 cursor-pointer"
                onClick={(e) => {
                  document.querySelector(".box").classList.add("opacity-0");
                }}
              >
                X
              </div>
              <div className="title">Get started</div>
              <hr className="mt-1 mb-2" />
              <div className="msg">
                <div className="flex items-center gap-0.5">
                  use <Keyboard text={"w,a,s,d"}></Keyboard> or{" "}
                  <Keyboard text={"↑,↓,→,←"}></Keyboard> to move{" "}
                </div>
                <div className="flex items-center gap-0.5">
                  use <Keyboard text={"z,x"}></Keyboard> or{" "}
                  <Keyboard word={" ↵ ,spacebar"}></Keyboard> to interact{" "}
                </div>
                <div>Then go 3 red marks 🔻 to know me more</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
