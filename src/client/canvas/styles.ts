import { CanvasJpDrawable, CanvasJpRandom } from "canvas-jp";
import { CanvasJpShape } from "canvas-jp/Shape";
import { TwitchUser } from "../../TwitchUser";
import makeArabesque from "./makeArabesque";
import { HaloParams, makeHalo } from "./makeHalo";
import { makeLandscape } from "./makeLandscape";
import { makeRandomWalker } from "./makeRandomWalker";

export interface StyleParams {
  style: string;
}

export type CarreauFactory<T = StyleParams> = (
  pixel: number,
  shape: CanvasJpShape,
  random: CanvasJpRandom,
  width: number,
  height: number,
  user: TwitchUser
) => {
  elements: CanvasJpDrawable[];
  params: T;
};

// export const styles: CarreauFactory[] = [makeArabesque];
export const styles: CarreauFactory[] = [
  makeHalo,
  makeLandscape,
  //   makeRandomWalker,
  makeArabesque,
];
