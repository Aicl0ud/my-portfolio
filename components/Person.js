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
    const currPos = {
      x: this.x,
      y: this.y,
    };
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

        if (this.findNearby(state, currPos) < 0 || state.arrow == "exit") {
          document.querySelector(".box").classList.add("opacity-0");
        }
      }
      //Reset animation
      if (this.movingProgressRemaining == 0) {
        this.updateSprite();
      }
    }
    this.calculateTime();
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
      //Find nearby location
      // `${this.x},${this.y}`;
      const currPos = {
        x: this.x,
        y: this.y,
      };
      const nearby = this.findNearby(state, currPos);

      if (nearby > -1) {
        var curr = { x: currPos.x / 16, y: currPos.y / 16 };
        var tarr = Object.keys(obj)[nearby];
        var raw_target = tarr.split(",");
        var target = { x: raw_target[0] / 16, y: raw_target[1] / 16 };
        //Make an interaction
        if (state.map.isAction(curr, target)) {
          document.querySelector(".title").textContent = obj[tarr].title;
          document.querySelector(".msg").innerHTML = obj[tarr].message;
          document.querySelector(".box").classList.remove("opacity-0");
          return;
        }
      }

      // var curr = { x: this.x / 16, y: this.y / 16 };
      // var raw_target = Object.keys(obj)[0].split(",");
      // var target = { x: raw_target[0] / 16, y: raw_target[1] / 16 };
      // //Make an interaction
      // if (state.map.isAction(curr, target)) {
      //   document.querySelector(".box").classList.remove("opacity-0");
      //   return;
      // }
    }
  }

  findNearby(state, position) {
    var obj = state.map.items;
    if (Object.keys(obj).includes(`${position.x - 16},${position.y}`)) {
      return Object.keys(obj).indexOf(`${position.x - 16},${position.y}`);
    }
    if (Object.keys(obj).includes(`${position.x + 16},${position.y}`)) {
      return Object.keys(obj).indexOf(`${position.x + 16},${position.y}`);
    }
    if (Object.keys(obj).includes(`${position.x},${position.y - 16}`)) {
      return Object.keys(obj).indexOf(`${position.x},${position.y - 16}`);
    }
    if (Object.keys(obj).includes(`${position.x},${position.y + 16}`)) {
      return Object.keys(obj).indexOf(`${position.x},${position.y + 16}`);
    }
    return -1;
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

  calculateTime() {
    document.querySelectorAll('#timeexp').forEach((e)=>{
      const data = e.dataset
      const today = new Date();
      const startDate = new Date(data.start);
      const endDate = new Date(data.end);
      const endOrToday = (data.end ? endDate : today);
      const year = Math.abs(endOrToday.getFullYear() - startDate.getFullYear());
      const month = Math.abs(endOrToday.getMonth() - startDate.getMonth());
      e.textContent = `${year} yr ${month} mos`;
    })
  }
}
export default Person;
