import { canvasJp } from "canvas-jp";
import { Translate } from "canvas-jp/transform";
import { makeUserElements } from "../canvas/makeUserElements";
import { TwitchData } from "../../DataManager";
import { TwitchUser } from "../../TwitchUser";

export const FresqueCanvasFunction = async (
  canvasElement: HTMLElement,
  width: number,
  height: number,
  data: TwitchData,
  onSelectUser: (user: TwitchUser) => void,
  onFocus: (user: TwitchUser, offsetX: number, offsetY: number) => void,
  onBlur: (user: TwitchUser, offsetX: number, offsetY: number) => void
): Promise<{
  canvasHeight: number;
  userWidth: number;
  userHeight: number;
  removeListeners: () => void;
}> => {
  const userWidth = 100;
  const userHeight = userWidth * 2;

  const margin = 10;

  const gap = Math.round(userWidth / 3);

  const numberOfUsersPerRows = Math.floor(width / (userWidth + gap * 2));
  const numberOfUsersPerTwoRows = numberOfUsersPerRows * 2 - 1;

  const canvasHeight =
    Math.ceil(
      Math.ceil(data.users.length / numberOfUsersPerTwoRows) *
        (userHeight + gap * 2) -
        gap +
        userHeight / 2
    ) +
    margin * 2;
  const canvasWidth =
    numberOfUsersPerRows * (userWidth + gap * 2) - gap * 2 + margin * 2;

  const removeListeners = await canvasJp(
    canvasElement,
    async function (t, frame, random) {
      const elements = data.users.flatMap((user, index) => {
        let positionY =
          Math.floor(Math.floor(index / numberOfUsersPerTwoRows)) + 1;
        let positionX = index % numberOfUsersPerTwoRows;
        const offsetX = (userWidth / 2 + gap) * positionX + margin;
        const offsetY =
          canvasHeight -
          ((userHeight + gap * 2) * positionY +
            (userHeight / 2 + gap) * (positionX % 2) -
            gap * 2 +
            margin);

        const userOffsetX = offsetX + userWidth / 2;
        const userOffsetY = canvasHeight - offsetY - userHeight;

        return Translate(
          offsetX,
          offsetY,
          makeUserElements(random, userWidth, userHeight, user, [
            {
              on: "click",
              trigger: () => {
                onSelectUser(user);
              },
            },
            {
              on: "focus",
              trigger: () => {
                onFocus(user, userOffsetX, userOffsetY);
              },
            },
            {
              on: "mouseenter",
              trigger: () => {
                onFocus(user, userOffsetX, userOffsetY);
              },
            },
            {
              on: "blur",
              trigger: () => {
                onBlur(user, userOffsetX, userOffsetY);
              },
            },
            {
              on: "mouseleave",
              trigger: () => {
                onBlur(user, userOffsetX, userOffsetY);
              },
            },
            {
              on: "keydown",
              trigger: (event: KeyboardEvent) => {
                if (event.key === "Space" || event.key === "Enter") {
                  onSelectUser(user);
                }
              },
            },
          ])
        );
      });
      return {
        elements: elements,
      };
    },
    {
      width: canvasWidth,
      height: canvasHeight,
      resolution: 1,
      title: "TwitchArt",
      animation: false,
      loop: false,
      embed: true,
      exportSketch: false,
      numberOfFrames: 0,
      interactive: true,
    }
  );

  return {
    canvasHeight,
    userWidth,
    userHeight,
    removeListeners,
  };
};
