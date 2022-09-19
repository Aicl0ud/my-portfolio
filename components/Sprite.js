import { Component } from "react";
import utils from "./utils";

class Sprite extends Component {
  constructor(config) {
    super(config);
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    //Shadow
    this.shadow = new Image();
    this.useShadow = true; //config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      "idle-up": [[0, 2]],
      "idle-left": [
        [4, 1],
        [5, 1],
        [6, 1],
        [7, 1],
      ],
      "walk-down": [[0, 0]],
      "walk-right": [
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [0, 3],
        [1, 3],
        [2, 3],
        [3, 3],
      ],
      "walk-up": [[0, 0]],
      "walk-left": [
        [4, 2],
        [5, 2],
        [6, 2],
        [7, 2],
        [4, 3],
        [5, 3],
        [6, 3],
        [7, 3],
      ],
    };
    this.currentAnimation = "idle-right"; // config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
    // return this.animations["idle-down"][0];
  }

  setAnimation(key) {
    // console.log(key);
    if (this.currentAnimation !== key) {
      if (key.includes("up")) {
        key = key.replace("up", this.currentAnimation.split("-")[1]);
        console.log(key);
      } else if (key.includes("down")) {
        key = key.replace("down", this.currentAnimation.split("-")[1]);
        console.log(key);
      } else {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
      }
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;
    //For debug position
    document.querySelector("#position").textContent = `${parseInt(
      cameraPerson.x / 16
    )}, ${parseInt(cameraPerson.y / 16)}`;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded &&
      ctx.drawImage(this.image, frameX * 32, frameY * 32, 32, 32, x, y, 32, 32);

    this.updateAnimationProgress();
  }
}

export default Sprite;
