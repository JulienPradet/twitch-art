import { canvasJp } from "canvas-jp";
import { makeUserElements } from "./src/client/canvas/makeUserElements";
import { TwitchUser } from "./src/TwitchUser";

const user: TwitchUser = {
  messageCount: 36,
  id: "253152270",
  displayName: "superroipatate",
};

const container: HTMLElement | null = document.querySelector("#container");
if (!container) {
  throw new Error(
    "Invalid HTML: should contain an element with id `container`."
  );
}

const width = 250;
const height = 500;

canvasJp(
  container,
  async function (t, frame) {
    return {
      elements: makeUserElements(width, height, user),
    };
  },
  {
    width: width,
    height: height,
    resolution: 1,
    title: "TwitchArt",
    animation: false,
    loop: false,
    embed: false,
    exportSketch: false,
    numberOfFrames: 0,
    interactive: false,
  }
);
