import React, { Component } from "react";
class Overworld extends Component {
  constructor(props) {
    super(props);
    this.element = props.element;
    this.canvas = props.element.querySelector(".game-canvas");
    this.ctx = props.element.querySelector("canvas").getContext("2d");
  }
  init() {
    console.log("True");
    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = "/images/maps/main/Main.gif";
    const x = 6;
    const y = 6;
    const shadow = new Image();
    shadow.onload = () => {
      this.ctx.drawImage(
        shadow,
        0, //left cut
        0, //top cut,
        32, //width of cut
        32, //height of cut
        x * 16 - 8,
        y * 16 - 18,
        32,
        32
      );
    };
    shadow.src = "/images/characters/shadow.png";
    const player = new Image();
    player.onload = () => {
      this.ctx.drawImage(
        player,
        0, //left cut
        0, //top cut,
        32, //width of cut
        32, //height of cut
        x * 16 - 8,
        y * 16 - 18,
        32,
        32
      );
    };
    player.src = "/images/characters/player/mPlayer_[human].png";
  }
}

export default Overworld;
