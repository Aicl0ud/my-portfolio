import React, { Component } from "react";
import Sprite from "../components/Sprite.js";
class GameObject extends Component {
  constructor(config) {
    super(config);
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "right";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/player/mPlayer_[human].png",
    });
  }

  mount(map) {
    console.log("mounting!");
    this.mounted = true;
    map.addWall(this.x, this.y);
  }

  update() {}
}

export default GameObject;
