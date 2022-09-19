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
    },
  };
};

export default Maps;
