import { canvasJp, CanvasJpFrameDefinition } from "canvas-jp";
import { makeUserElements } from "../canvas/makeUserElements";
import { TwitchUser } from "../../TwitchUser";

export const AlertCanvasFunction = (
  canvasElement: HTMLElement,
  width: number,
  height: number,
  user: TwitchUser
) => {
  canvasJp(
    canvasElement,
    async function (t, frame, random) {
      return {
        elements: makeUserElements(random, width, height, user),
      };
    },
    {
      width: width,
      height: height,
      resolution: 1,
      title: "TwitchArt",
      animation: false,
      loop: false,
      embed: true,
      exportSketch: false,
      numberOfFrames: 0,
      interactive: false,
    }
  );
};
