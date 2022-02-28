import * as math from "canvas-sketch-util/math";
import { CanvasJpDrawable, CanvasJpStrokeStyle } from "canvas-jp";
import { CanvasJpColorHsv, Color } from "canvas-jp/Color";
import { SmoothLine } from "canvas-jp/Line";
import { Point } from "canvas-jp/Point";
import { Shape } from "canvas-jp/Shape";
import { CarreauFactory, StyleParams } from "./styles";
import { Circle } from "canvas-jp/Circle";
import { rotate, Translate } from "canvas-jp/transform";

export interface PaperParams extends StyleParams {}

const background = Color(210 / 360, 0.45, 0.314);
const palette = [
  // Color(206 / 360, 0.5, 0.11),
  Color(214 / 360, 0.52, 0.5),
  Color(180 / 360, 0.1, 0.65),
  Color(5 / 360, 0.6, 0.93),
  Color(40 / 360, 0.66, 1),
  Color(37 / 360, 0.18, 0.99),
];

const makePaper: CarreauFactory<PaperParams> = (
  pixel,
  shape,
  random,
  width,
  height,
  user
) => {
  const colorNoiseFactor = math.clamp(random.gaussian(10, 5), 0, 30);
  const shapeOffset =
    random.value() > 0.3 ? math.mapRange(random.value(), 0, 1, 0.1, 0.8) : 0;
  const center = Point(0, 0);
  const strokeColor = random.pick(palette);

  let remainingColors = palette.filter((color) => color !== strokeColor);
  if (random.value() < 0.2) {
    remainingColors = [random.pick(remainingColors)];
  }

  const numberOfPointsPerShapes = Math.round(
    math.mapRange(random.value(), 0, 1, 3, 8)
  );
  const makePaperSheet = (
    size: number,
    strokeWidth: number,
    angle: number,
    color: CanvasJpColorHsv
  ) => {
    return Shape(
      new Array(numberOfPointsPerShapes)
        .fill(null)
        .map((_, index) => {
          const progress = index / numberOfPointsPerShapes;
          return Point(
            size * Math.cos(progress * Math.PI * 2),
            size * Math.sin(progress * Math.PI * 2) + size * shapeOffset
          );
        })
        .map((point) => rotate(center, angle, point)),
      {
        color: color,
        opacity: 1,
      },
      {
        color: strokeColor,
        width: strokeWidth,
        opacity: 1,
      }
    );
  };

  const numberOfElements = Math.round(
    math.mapRange(random.value(), 0, 1, 20, 150)
  );
  const rotations = math.mapRange(random.value(), 0, 1, 2, 10);
  const minStrokeWidth = 1 * pixel;
  const maxStrokeWidth = math.mapRange(random.value(), 0, 1, 5, 15) * pixel;
  const isLinearAngle = random.value() > 0.3;
  const elements = new Array<CanvasJpDrawable>().concat(
    new Array(numberOfElements).fill(null).map((_, index) => {
      const progress = 1 - index / numberOfElements;
      const angle = math.mapRange(
        isLinearAngle ? progress : Math.pow(progress, 1.5),
        0,
        1,
        0,
        Math.PI * 2 * rotations
      );
      const maxSize = (height / 3) * 2;
      const size = maxSize * progress;
      return makePaperSheet(
        size,
        math.mapRange(
          Math.pow(progress, 1.5),
          0,
          1,
          minStrokeWidth,
          maxStrokeWidth
        ),
        angle,
        remainingColors[
          Math.floor(
            math.mapRange(
              random.noise1D(Math.pow(progress, 0.7) * colorNoiseFactor),
              -1,
              1,
              0,
              1
            ) * remainingColors.length
          )
        ]
      );
    })
  );

  return {
    elements: new Array<CanvasJpDrawable>(
      Translate(width / 2, height / 2, elements)
    ).concat(
      Shape(
        [
          Point(width / 2, 0),
          Point(width, height / 2),
          Point(width / 2, height),
          Point(0, height / 2),
        ],
        undefined,
        {
          color: strokeColor,
          opacity: 1,
          width: width / 10,
        }
      )
    ),
    params: {
      style: "Paper",
    },
  };
};

export default makePaper;
