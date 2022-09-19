import GameObject from "./GameObject";
import Person from "./Person";
import utils from "./utils";
const Maps = () => {
  window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "/images/maps/main/Main.gif",
      upperSrc: "/images/maps/main/Main-Top.png",
      gameObjects: {
        player: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(6),
          y: utils.withGrid(5),
        }),
        npc1: new Person({
          x: utils.withGrid(4),
          y: utils.withGrid(10),
          src: "/images/characters/player/fPlayer_[human].png",
        }),
      },
      walls: {
        //Well at the center
        [utils.asGridCoord(5, 6)]: true,
        [utils.asGridCoord(6, 6)]: true,
        [utils.asGridCoord(7, 6)]: true,
        [utils.asGridCoord(8, 6)]: true,
        [utils.asGridCoord(5, 7)]: true,
        [utils.asGridCoord(8, 7)]: true,
        [utils.asGridCoord(5, 8)]: true,
        [utils.asGridCoord(8, 8)]: true,
        [utils.asGridCoord(5, 9)]: true,
        [utils.asGridCoord(6, 9)]: true,
        [utils.asGridCoord(7, 9)]: true,
        [utils.asGridCoord(8, 9)]: true,
        //Wall top
        [utils.asGridCoord(3, 3)]: true,
        [utils.asGridCoord(4, 3)]: true,
        [utils.asGridCoord(5, 3)]: true,
        [utils.asGridCoord(6, 3)]: true,
        [utils.asGridCoord(7, 3)]: true,
        [utils.asGridCoord(8, 3)]: true,
        [utils.asGridCoord(9, 3)]: true,
        [utils.asGridCoord(10, 3)]: true,
        //Wall left
        [utils.asGridCoord(2, 4)]: true,
        [utils.asGridCoord(2, 5)]: true,
        [utils.asGridCoord(2, 6)]: true,
        [utils.asGridCoord(2, 7)]: true,
        [utils.asGridCoord(2, 8)]: true,
        [utils.asGridCoord(2, 9)]: true,
        [utils.asGridCoord(2, 10)]: true,
        [utils.asGridCoord(2, 11)]: true,
        //Wall right
        [utils.asGridCoord(11, 4)]: true,
        [utils.asGridCoord(11, 5)]: true,
        [utils.asGridCoord(11, 6)]: true,
        [utils.asGridCoord(11, 7)]: true,
        [utils.asGridCoord(11, 8)]: true,
        [utils.asGridCoord(11, 9)]: true,
        [utils.asGridCoord(11, 10)]: true,
        [utils.asGridCoord(11, 11)]: true,
        //Wall top
        [utils.asGridCoord(3, 12)]: true,
        [utils.asGridCoord(4, 12)]: true,
        [utils.asGridCoord(5, 12)]: true,
        [utils.asGridCoord(6, 12)]: true,
        [utils.asGridCoord(7, 12)]: true,
        [utils.asGridCoord(8, 12)]: true,
        [utils.asGridCoord(9, 12)]: true,
        [utils.asGridCoord(10, 12)]: true,
      },
    },
  };
};

export default Maps;
