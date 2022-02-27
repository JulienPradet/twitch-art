import {
  CanvasJpDrawable,
  CanvasJpRandom,
  CanvasJpStrokeStyle,
} from "canvas-jp";
import { Polygon } from "canvas-jp/Polygon";
import { Point } from "canvas-jp/Point";
import { Color } from "canvas-jp/Color";
import { CanvasJpShape } from "canvas-jp/Shape";
import {
  CanvasJpEventHandlerList,
  ClickRegion,
  RenderOnlyWhenVisible,
} from "canvas-jp/interaction";
import { TwitchUser } from "../../TwitchUser";
import { Seed } from "canvas-jp/Seed";
import { Clip } from "canvas-jp/Clip";
import { makeHalo } from "./makeHalo";
import { CarreauFactory, StyleParams, styles } from "./styles";
import { makeLandscape } from "./makeLandscape";

const palette = [
  // Color(206 / 360, 0.5, 0.11),
  Color(214 / 360, 0.52, 0.5),
  Color(180 / 360, 0.1, 0.65),
  Color(5 / 360, 0.6, 0.93),
  Color(40 / 360, 0.66, 1),
  Color(37 / 360, 0.18, 0.99),
];

/**
 * @param width
 * @param height = width * 2
 * @param user
 * @param onClick
 */
const makeElements = (
  random: CanvasJpRandom,
  width: number,
  height: number,
  user: TwitchUser,
  events?: CanvasJpEventHandlerList
): { elements: CanvasJpDrawable[]; params: { style: string } } => {
  const makeClickRegion = (
    shape: CanvasJpShape,
    events: CanvasJpEventHandlerList
  ) => {
    return ClickRegion(shape.points, events);
  };

  const pixel = height / 500;

  const shape = Polygon([
    Point(width / 2, 0),
    Point(0, height / 2),
    Point(width / 2, height),
    Point(width, height / 2),
  ]).toShape(undefined, {
    color: Color(206 / 360, 0.5, 0.11),
    width: 0.5,
    opacity: 1,
    style: CanvasJpStrokeStyle.round,
  });

  const styleIndex = Math.floor(random.value() * styles.length);
  const styleFactory = styles[styleIndex];

  const { elements, params } = styleFactory(
    pixel,
    shape,
    random,
    width,
    height,
    user
  );

  if (events && events.length > 0) {
    elements.push(makeClickRegion(shape, events));
  }

  const clippedElements = [Clip(shape, elements)];

  return {
    elements:
      events && events.length > 0
        ? [RenderOnlyWhenVisible(shape.points, clippedElements)]
        : clippedElements,
    params: params,
  };
};

export const makeUserElements = (
  random: CanvasJpRandom,
  width: number,
  height: number,
  user: TwitchUser,
  events?: CanvasJpEventHandlerList,
  onParams?: (params: StyleParams) => void,
  useSeed = true
): CanvasJpDrawable[] => {
  if (useSeed) {
    return [
      Seed(Number(user.id), (random: CanvasJpRandom) => {
        const { elements, params } = makeElements(
          random,
          width,
          height,
          user,
          events
        );
        if (onParams) {
          onParams(params);
        }

        return elements;
      }),
    ];
  } else {
    return makeElements(random, width, height, user, events).elements;
  }
};
