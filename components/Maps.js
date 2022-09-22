import GameObject from "./GameObject";
import Person from "./Person";
import utils from "./utils";
const Maps = () => {
  window.OverworldMaps = {
    Main: {
      lowerSrc: "/images/maps/bed/base.png",
      upperSrc: "/images/maps/bed/top.png",
      gameObjects: {
        player: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(6),
          y: utils.withGrid(5),
        }),
        npc1: new Person({
          x: utils.withGrid(4),
          y: utils.withGrid(11),
          src: "/images/characters/player/fPlayer_[human].png",
        }),
      },
      walls: {
        //Wall top
        [utils.asGridCoord(2, 2)]: true,
        [utils.asGridCoord(3, 2)]: true,
        [utils.asGridCoord(4, 2)]: true,
        [utils.asGridCoord(5, 2)]: true,
        [utils.asGridCoord(6, 2)]: true,
        [utils.asGridCoord(7, 2)]: true,
        [utils.asGridCoord(8, 2)]: true,
        [utils.asGridCoord(9, 2)]: true,
        [utils.asGridCoord(10, 2)]: true,
        [utils.asGridCoord(11, 2)]: true,

        //Wall left
        [utils.asGridCoord(1, 3)]: true,
        [utils.asGridCoord(1, 4)]: true,
        [utils.asGridCoord(1, 5)]: true,
        [utils.asGridCoord(1, 6)]: true,
        [utils.asGridCoord(1, 7)]: true,
        [utils.asGridCoord(1, 8)]: true,
        [utils.asGridCoord(1, 9)]: true,
        [utils.asGridCoord(1, 10)]: true,
        [utils.asGridCoord(1, 11)]: true,

        //Wall right
        [utils.asGridCoord(12, 3)]: true,
        [utils.asGridCoord(12, 4)]: true,
        [utils.asGridCoord(12, 5)]: true,
        [utils.asGridCoord(12, 6)]: true,
        [utils.asGridCoord(12, 7)]: true,
        [utils.asGridCoord(12, 8)]: true,
        [utils.asGridCoord(12, 9)]: true,
        [utils.asGridCoord(12, 10)]: true,
        [utils.asGridCoord(12, 11)]: true,

        //Wall bottom
        [utils.asGridCoord(2, 12)]: true,
        [utils.asGridCoord(3, 12)]: true,
        [utils.asGridCoord(4, 12)]: true,
        [utils.asGridCoord(5, 12)]: true,
        [utils.asGridCoord(6, 12)]: true,
        [utils.asGridCoord(7, 12)]: true,
        [utils.asGridCoord(8, 12)]: true,
        [utils.asGridCoord(9, 12)]: true,
        [utils.asGridCoord(10, 12)]: true,
        [utils.asGridCoord(11, 12)]: true,

        //Bed
        [utils.asGridCoord(2, 4)]: true,
        [utils.asGridCoord(3, 4)]: true,

        //Books
        [utils.asGridCoord(10, 4)]: true, //Blue
        [utils.asGridCoord(10, 10)]: true, //Green
        [utils.asGridCoord(4, 10)]: true, //Red

        //Object block
        [utils.asGridCoord(7, 6)]: true,
        [utils.asGridCoord(8, 6)]: true,
        [utils.asGridCoord(9, 6)]: true,
        [utils.asGridCoord(7, 7)]: true,
        [utils.asGridCoord(8, 7)]: true,
        [utils.asGridCoord(9, 7)]: true,
        [utils.asGridCoord(11, 7)]: true,
        [utils.asGridCoord(11, 11)]: true,
        [utils.asGridCoord(2, 8)]: true,
        [utils.asGridCoord(3, 8)]: true,
        [utils.asGridCoord(4, 8)]: true,
        [utils.asGridCoord(2, 9)]: true,
        [utils.asGridCoord(2, 10)]: true,
        [utils.asGridCoord(2, 11)]: true,
      },
    },
  };
};

export default Maps;
