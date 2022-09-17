import GameObject from "./GameObject";
const Maps = () => {
  window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "/images/maps/main/Main.gif",
      upperSrc: "/images/maps/main/Main.gif",
      gameObjects: {
        hero: new GameObject({
          x: 5,
          y: 6,
        }),
        npc1: new GameObject({
          x: 7,
          y: 9,
          src: "/images/characters/player/mPlayer_[human].png",
        }),
      },
    },
  };
};

export default Maps;
