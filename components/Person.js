import React, { Component } from "react";
import GameObject from "../components/GameObject.js";
class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;

    this.isPlayerControlled = config.isPlayerControlled || false;
    this.currentDirection = config.direction || "right";

    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      //More cases for starting to walk will come here
      //
      //

      //Case: We're keyboard ready and have an arrow pressed
      if (this.isPlayerControlled && state.arrow) {
        if ("updownleftright".includes(state.arrow)) {
          this.startBehavior(state, {
            type: "walk",
            direction: state.arrow,
          });
          this.updateSprite(state);
        }

        if ("interact".includes(state.arrow)) {
          this.startBehavior(state, {
            type: "interact",
            direction: state.arrow,
          });
        }
      }
      //Reset animation
      if (this.movingProgressRemaining == 0) {
        this.updateSprite();
      }
    }
  }

  startBehavior(state, behavior) {
    //Set character direction to whatever behavior has
    if (behavior.type === "walk") {
      this.direction = behavior.direction;

      if (behavior.direction != "up" && behavior.direction != "down") {
        this.currentDirection = behavior.direction;
      }
      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }

      //Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
    }

    if (behavior.type === "interact") {
      var obj = state.map.items;
      var curr = { x: this.x / 16, y: this.y / 16 };
      var raw_target = Object.keys(obj)[0].split(",");
      var target = { x: raw_target[0] / 16, y: raw_target[1] / 16 };
      //Make an interaction
      if (state.map.isAction(curr, target)) {
        document.querySelector(".box").classList.remove("hidden");
        return;
      }
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.currentDirection);
      return;
    }
    this.sprite.setAnimation("idle-" + this.currentDirection);
  }
}
export default Person;
