import { Component, useEffect } from "react";
import { GameObject } from "../components/GameObject.js";
import utils from "./utils";

class OverworldMap extends Component {
  constructor(config) {
    super(config);
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.items = config.items || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  isAction(currentPosition, targetPosition) {
    if (
      utils.arrayEquals(
        [currentPosition.x - 1, currentPosition.y],
        [targetPosition.x, targetPosition.y]
      ) ||
      utils.arrayEquals(
        [currentPosition.x + 1, currentPosition.y],
        [targetPosition.x, targetPosition.y]
      ) ||
      utils.arrayEquals(
        [currentPosition.x, currentPosition.y - 1],
        [targetPosition.x, targetPosition.y]
      ) ||
      utils.arrayEquals(
        [currentPosition.x, currentPosition.y + 1],
        [targetPosition.x, targetPosition.y]
      )
    ) {
      return true;
    }
    return false;
  }

  mountObjects() {
    Object.values(this.gameObjects).forEach((o) => {
      //TODO: determine if this object should actually mount
      // o.mount(this);
    });
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

export default OverworldMap;
