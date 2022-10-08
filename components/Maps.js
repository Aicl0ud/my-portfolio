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
          x: utils.withGrid(2),
          y: utils.withGrid(3),
          direction: "left",
          useShadow: true,
        }),
        // npc1: new Person({
        //   x: utils.withGrid(4),
        //   y: utils.withGrid(11),
        //   useShadow: true,
        //   src: "/images/characters/player/fPlayer_[human].png",
        // }),
        arrow1: new Person({
          x: utils.withGrid(10),
          y: utils.withGrid(3),
          src: "/images/objects/red-arrow.png",
          direction: "idle",
        }),
        arrow2: new Person({
          x: utils.withGrid(10),
          y: utils.withGrid(9),
          src: "/images/objects/red-arrow.png",
          direction: "idle",
        }),
        arrow3: new Person({
          x: utils.withGrid(4),
          y: utils.withGrid(9),
          src: "/images/objects/red-arrow.png",
          direction: "idle",
        }),
      },
      npcs: {
        [utils.asGridCoord(4, 11)]: true, //NPC
      },
      items: {
        [utils.asGridCoord(10, 4)]: {
          title: "About me",
          message:
            "Sawasdee 🙏! I'm Kiw(sound Q in English) currently lives in Bankok, Thailand. I graduated🎓 from faculty of ICT, Mahidol University with B.Sc degree. I'm a self tough learner💪 and 💚 to explore new things about coding 💻. The most familiar coding language is javascript. Interested in blockchain 🔗 and investment 🏦.",
        },
        [utils.asGridCoord(10, 10)]: {
          title: "Experiences & Skills",
          message: `
          <div id="title-primary">Education 📚</div>
          <div id="title-secondary">Mahidol University, Nakhon Pathom – Bachelor’s degree</div>
          <div>Aug 2017 - Jun 2021</div>
          <div id="title-secondary">St. Peter School, Nakhon Pathom – High school</div>
          <div>Oct 2004 - May 2017</div>
          <div id="title-primary">Experiences 👨‍💻</div>
          <div class="flex gap-1"><div id="timeexp"></div> as a software developer @Nuxos Consulting Co,. Ltd.</div>
          <div id="title-primary">Skills</div>
          <div>
            <div id="title-secondary">Communication:</div>
            <li class="list-disc">English</li>
            <li class="list-disc">Thai</li>
          </div>
          <div>
            <div id="title-secondary">Software & Programs:</div> 
            <div class="w-[60%] flex flex-wrap">
              <img class="icon" src="/icons/vscode.png" alt="VSCode" title="VSCode"/>
              <img class="icon" src="/icons/github.png" alt="Github" title="Github"/>
              <img class="icon" src="/icons/js.png" alt="javascript" title="javascript"/>
              <img class="icon" src="/icons/react.png" alt="React" title="React"/>
              <img class="icon invert" src="/icons/nextjs.png" alt="Next.js" title="Next.js"/>
              <img class="icon" src="/icons/csharp.png" alt="C#" title="C#"/>
              <img class="icon" src="/icons/java.png" alt="Java" title="Java"/>
              <img class="icon" src="/icons/solidity.png" alt="Solidity" title="Solidity"/>
              <img class="icon" src="/icons/rust.png" alt="Rust" title="Rust"/>
              <img class="icon brighten" src="/icons/etherjs.png" alt="Ethers.js" title="Ethers.js"/>
              <img class="icon" src="/icons/hardhat.png" alt="hardhat" title="hardhat"/>
              <img class="icon" src="/icons/rails.png" alt="Ruby on Rails" title="Ruby on Rails"/>
              <img class="icon" src="/icons/tailwind.png" alt="Tailwind CSS" title="Tailwind CSS"/>
              <img class="icon" src="/icons/bootstrap.png" alt="Bootstrap" title="Bootstrap"/>
              <img class="icon" src="/icons/rollbar.png" alt="Rollbar" title="Rollbar"/>
            </div>
          </div>
          <div>
            <div id="title-secondary">Management:</div>
            <li class="list-disc">Excellent management, organized, and flexible working with well-solving skills.</li>
          </div>
          <div>
            <div id="title-secondary">Multitasking:</div>
            <li class="list-disc">Good in handling multiple tasks and handling stress well.</li>
          </div>
          `,
        },
        [utils.asGridCoord(4, 10)]: {
          title: "Contact 🪪",
          message: `<div class="grid grid-cols-6">
              <div>Email:</div>
              <a href="mailto:teerasit.won@gmail.com" target="_blank" class="col-span-5">teerasit.won@gmail.com</a> 
              <div>Mobile:</div>
              <a href="tel:+66925531998" target="_blank" class="col-span-5">+66925531998</a>
              <div>LinkedIn:</div>
              <a href="https://www.linkedin.com/in/teerasit-wongpa/" target="_blank" class="col-span-5">teerasit-wongpa</a>
            </div>`,
        },
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
