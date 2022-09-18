import React, { Component } from "react";
import Sprite from "../components/Sprite.js";
class GameObject extends Component {
  constructor(config) {
    super(config);
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/player/mPlayer_[human].png",
    });
  }
  update() {}
}

export default GameObject;
