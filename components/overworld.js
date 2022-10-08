import React, { Component } from "react";
import GameObject from "../components/GameObject.js";
import OverworldMap from "../components/OverworldMap.js";
import DirectionInput from "../components/DirectionInput.js";
import utils from "../components/utils.js";

class Overworld extends Component {
  constructor(props) {
    super(props);
    this.element = props.element;
    this.canvas = {
      width: utils.withGrid(320),
      height: utils.withGrid(180),
    };
    this.ctx = props.element.querySelector("canvas").getContext("2d");
    this.map = null;
  }
  init() {
    this.map = new OverworldMap(window.OverworldMaps.Main);
    this.map.mountObjects();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.player;

      //Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        // console.log(object);
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.sprite.draw(this.ctx, cameraPerson);
      });

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }
}

export default Overworld;
