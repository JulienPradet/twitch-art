import { canvasJp } from "canvas-jp";
import { Translate } from "canvas-jp/transform";
import { makeUserElements } from "../canvas/makeUserElements";
import { TwitchData } from "../../DataManager";
import { TwitchUser } from "../../TwitchUser";

export const FresqueCanvasFunction = (
  canvasElement: HTMLElement,
  width: number,
  height: number,
  data: TwitchData,
  onSelectUser: (user: TwitchUser) => void
) => {
  const userWidth = 100;
  const userHeight = userWidth * 2;

  const gap = Math.round(userWidth / 3);

  const numberOfUsersPerRows = Math.floor(width / (userWidth + gap * 2));
  const numberOfUsersPerTwoRows = numberOfUsersPerRows * 2 - 1;

  const canvasHeight = Math.ceil(
    Math.ceil(data.users.length / numberOfUsersPerTwoRows) *
      (userHeight + gap * 2) +
      gap +
      userHeight / 2
  );
  const canvasWidth = numberOfUsersPerRows * (userWidth + gap * 2);

  return canvasJp(
    canvasElement,
    async function (t, frame, random) {
      const elements = data.users.flatMap((user, index) => {
        let positionY = Math.floor(Math.floor(index / numberOfUsersPerTwoRows));
        let positionX = index % numberOfUsersPerTwoRows;
        const offsetX = (userWidth / 2 + gap) * positionX + gap;
        const offsetY =
          (userHeight + gap * 2) * positionY +
          (userHeight / 2 + gap) * (positionX % 2) +
          gap;

        return Translate(
          offsetX,
          offsetY,
          makeUserElements(random, userWidth, userHeight, user, () => {
            onSelectUser(user);
          })
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
};
