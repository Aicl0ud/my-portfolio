import GameObject from "./GameObject";
import Person from "./Person";
import utils from "./utils";
const Maps = () => {
  window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "/images/maps/main/Main.gif",
      upperSrc: "/images/maps/main/Main-Top.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(6),
        }),
        npc1: new Person({
          x: utils.withGrid(7),
          y: utils.withGrid(9),
          src: "/images/characters/player/fPlayer_[human].png",
        }),
      },
    },
  };
};

export default Maps;
