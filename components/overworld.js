import React, { Component } from "react";
import GameObject from "../components/GameObject.js";
import OverworldMap from "../components/OverworldMap.js";
import DirectionInput from "../components/DirectionInput.js";

class Overworld extends Component {
  constructor(props) {
    super(props);
    this.element = props.element;
    this.canvas = props.element.querySelector(".game-canvas");
    this.ctx = props.element.querySelector("canvas").getContext("2d");
    this.map = null;
  }
  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.directionInput = new DirectionInput();
    this.directionInput.init();
    this.startGameLoop();
    //Draw Lower layer
    this.map.drawLowerImage(this.ctx);
  }
  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx);

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
        });
        object.sprite.draw(this.ctx);
      });

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }
}

export default Overworld;
