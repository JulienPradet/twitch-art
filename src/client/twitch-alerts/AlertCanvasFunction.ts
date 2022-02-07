import { canvasJp, CanvasJpFrameDefinition } from "canvas-jp";
import { makeUserElements } from "../canvas/makeUserElements";
import { TwitchUser } from "../../TwitchUser";
import { StyleParams } from "../canvas/styles";

export const AlertCanvasFunction = (
  canvasElement: HTMLElement,
  width: number,
  height: number,
  user: TwitchUser
): Promise<StyleParams> => {
  return new Promise<StyleParams>((resolve) => {
    canvasJp(
      canvasElement,
      async function (t, frame, random) {
        return {
          elements: makeUserElements(
            random,
            width,
            height,
            user,
            undefined,
            (params) => resolve(params)
          ),
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
  });
};
