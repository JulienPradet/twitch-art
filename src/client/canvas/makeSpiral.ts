import * as math from "canvas-sketch-util/math";
import { CanvasJpDrawable, CanvasJpStrokeStyle } from "canvas-jp";
import { Color } from "canvas-jp/Color";
import { SmoothLine } from "canvas-jp/Line";
import { Point } from "canvas-jp/Point";
import { Shape } from "canvas-jp/Shape";
import { CarreauFactory, StyleParams } from "./styles";
import { Circle } from "canvas-jp/Circle";

export interface SpiralParams extends StyleParams {}

const background = Color(210 / 360, 0.45, 0.314);
const palette = [
  // Color(206 / 360, 0.5, 0.11),
  Color(214 / 360, 0.52, 0.5),
  Color(180 / 360, 0.1, 0.65),
  Color(5 / 360, 0.6, 0.93),
  Color(40 / 360, 0.66, 1),
  Color(37 / 360, 0.18, 0.99),
];

const makeSpiral: CarreauFactory<SpiralParams> = (
  pixel,
  shape,
  random,
  width,
  height,
  user
) => {
  const background = random.pick(palette);
  const lineStroke = random.pick(
    palette.filter((color) => color !== background)
  );
  const isCircleStroke = random.value() > 0.9;
  const circleIsMonochrome = isCircleStroke;
  const circleColor = circleIsMonochrome
    ? random.pick(
        palette.filter((color) => color !== background && color !== lineStroke)
      )
    : null;
  const maxNoise = random.value() < 0.2 ? 0 : 20 * pixel;

  const maxRadius = height / 3;
  const numberOfRotations = math.mapRange(
    Math.sqrt(random.value()),
    0,
    1,
    3,
    5
  );
  const numberOfPoints = Math.round(
    math.mapRange(random.value(), 0, 1, 500, 900)
  );
  const points = new Array(numberOfPoints).fill(null).map((_, index) => {
    const progress = index / numberOfPoints;
    const radius =
      maxRadius * Math.pow(progress, 1.1) +
      Math.pow(progress, 2) * random.value() * maxNoise;

    return Point(
      width / 2 +
        radius *
          Math.cos(Math.pow(progress, 0.7) * Math.PI * 2 * numberOfRotations),
      height / 2 +
        radius *
          1.5 *
          Math.sin(Math.pow(progress, 0.7) * Math.PI * 2 * numberOfRotations)
    );
  });

  const circles = points
    .filter((_, index) => {
      return index % 2 === 0;
    })
    .map((position, index) => {
      const progress = index / (points.length / 2 - 1);
      const circleRadius = math.mapRange(
        math.clamp(
          progress + math.mapRange(random.value(), 0, 1, -0.1, 0.1),
          0,
          1
        ),
        0,
        1,
        2 * pixel,
        25 * pixel
      );
      if (isCircleStroke) {
        return Circle(
          position,
          circleRadius,
          {
            color: background,
            opacity: 1,
          },
          {
            width: circleRadius / 2,
            color: circleColor ?? random.pick(palette),
            opacity: 1,
          }
        );
      } else {
        return Circle(position, circleRadius, {
          color: circleColor ?? random.pick(palette),
          opacity: 1,
        });
      }
    });

  const line = SmoothLine(points, 0.3, {
    color: lineStroke,
    opacity: 1,
    width: 2 * pixel,
    style: CanvasJpStrokeStyle.round,
  });

  let elements = new Array<CanvasJpDrawable>(
    Shape(shape.points, { color: background, opacity: 1 })
  );

  if (circleIsMonochrome || isCircleStroke) {
    elements = elements.concat(line).concat(circles);
  } else {
    elements = elements.concat(circles).concat(line);
  }

  elements = elements.concat(
    Shape(
      [
        Point(width / 2, 0),
        Point(width, height / 2),
        Point(width / 2, height),
        Point(0, height / 2),
      ],
      undefined,
      {
        color: (isCircleStroke ? circleColor : lineStroke) ?? background,
        opacity: 1,
        width: width / 10,
      }
    )
  );

  return {
    elements: elements,
    params: {
      style: "Spiral",
    },
  };
};

export default makeSpiral;
