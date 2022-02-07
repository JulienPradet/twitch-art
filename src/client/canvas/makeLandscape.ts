import { CanvasJpDrawable } from "canvas-jp";
import { Circle } from "canvas-jp/Circle";
import { Color, Gradient } from "canvas-jp/Color";
import { CurvePoint, Point } from "canvas-jp/Point";
import { getInBetween } from "canvas-jp/position";
import { Shape, SmoothShape } from "canvas-jp/Shape";
import { translateVector } from "canvas-jp/transform";
import * as math from "canvas-sketch-util/math";
import { CarreauFactory, StyleParams } from "./styles";
import { wobbleLine } from "./wobble";
import { angle } from "canvas-jp/angle";

export interface LandscapeParams extends StyleParams {}

const WeightedMean = (a: number, b: number, factor = 0.5) =>
  a * factor + b * (1 - factor);

const palette = [
  //   Color(206 / 360, 0.5, 0.11),
  Color(214 / 360, 0.52, 0.5),
  Color(180 / 360, 0.1, 0.65),
  Color(5 / 360, 0.6, 0.93),
  Color(40 / 360, 0.66, 1),
  Color(37 / 360, 0.18, 0.99),
];

const makeLandscape: CarreauFactory<LandscapeParams> = (
  pixel,
  shape,
  random,
  width,
  height,
  user
) => {
  let colors = random
    .shuffle(palette)
    .slice(0, 3)
    .sort((colorA, colorB) => {
      return colorB.v - colorA.v;
    });

  if (random.value() < 0.1) {
    colors = random.shuffle(colors);
  }

  const numberOfLayers =
    random.value() < 0.05 ? 0 : Math.round(random.value() * 4 + 3);

  const bottom = shape.points[0];
  const left = shape.points[1];
  const right = shape.points[3];
  const leftHeightStart = (random.value() * 0.4 + 0.35) * height;
  const rightHeightStart = (random.value() * 0.4 + 0.35) * height;
  const heightStart =
    (0.55 + random.value() * 0.7) *
    WeightedMean(leftHeightStart, rightHeightStart);

  const easeProgress = (p: number): number => Math.pow(p, 0.4);

  const wobbleStrength = pixel * (random.value() * 9 + 5);
  const curvature = random.value() * 0.2 + 0.1; // 0 no curve, 1 => veeery flat

  const layers: CanvasJpDrawable[] = new Array(numberOfLayers)
    .fill(null)
    .map((_, index) => {
      let progress = easeProgress((index + 1) / numberOfLayers);
      progress = math.clamp(
        progress + random.value() * 0.3 * (1 / (progress + 1)),
        0,
        1
      );

      const previousProgress = easeProgress(index / numberOfLayers);
      const leftHeight = leftHeightStart * progress;
      const rightHeight = rightHeightStart * progress;
      const centerHeight = heightStart * progress;
      const previousCenterHeight = heightStart * (previousProgress * 0.5 - 0.1);

      const topLeft = Point(left.x, leftHeight, 0);
      const topCenter = Point(bottom.x, centerHeight);
      const topRight = Point(right.x, rightHeight, 0);

      const layerAngle =
        angle(topLeft, topRight) + ((random.value() - 0.5) * Math.PI) / 2;

      const topLeftLine = wobbleLine(
        random,
        CurvePoint(topLeft.x, topLeft.y, topLeft, topLeft),
        CurvePoint(
          topCenter.x,
          topCenter.y,
          translateVector(-width * curvature, layerAngle, topCenter),
          topCenter
        ),
        wobbleStrength * WeightedMean(progress, 1),
        3
      );

      const topRightLine = wobbleLine(
        random,
        CurvePoint(
          topCenter.x,
          topCenter.y,
          topCenter,
          translateVector(width * curvature, layerAngle, topCenter)
        ),
        CurvePoint(topRight.x, topRight.y, topRight, topRight),
        wobbleStrength * WeightedMean(progress, 1),
        3
      );

      return SmoothShape(
        [
          Point(left.x, previousCenterHeight), // left bottom
          Point(left.x, leftHeight, 0), // left top
          ...topLeftLine,
          ...topRightLine.slice(1),
          Point(right.x, rightHeight, 0), // right top
          Point(right.x, previousCenterHeight), // right bottom
        ],
        0.3,
        {
          color: Gradient(
            [
              Color.mix(
                colors[2],
                Color(
                  colors[2].h,
                  math.clamp(colors[2].s - 0.1, 0, 1),
                  math.clamp(colors[2].v - 0.2, 0, 1)
                ),
                previousProgress
              ),
              Color.mix(colors[1], colors[2], progress),
            ],
            Math.PI / 2
          ),
          opacity: 1,
        }
      );
    })
    .reverse();

  const elements = new Array<CanvasJpDrawable>(
    Shape(shape.points, {
      color: Gradient(
        [
          Color(colors[0].h, colors[0].s, math.clamp(colors[0].v - 0.05, 0, 1)),
          Color(
            colors[0].h,
            math.clamp(colors[0].s - 0.1, 0, 1),
            math.clamp(colors[0].v + 0.15, 0, 1)
          ),
        ],
        Math.PI / 2
      ),
      opacity: 1,
    })
  )
    .concat(
      random.value() > 0.1 && heightStart < height * 0.7
        ? [
            Circle(
              Point(random.value() * 0.3 + 0.425 * width, heightStart * 1.2),
              random.value() * width * 0.2,
              {
                color: Color(
                  colors[0].h,
                  colors[0].s * 0.3,
                  WeightedMean(1, colors[0].v, 0.9)
                ),
                opacity: 1,
              }
            ),
          ]
        : []
    )
    .concat(layers);

  const params: LandscapeParams = {
    style: "Landscape",
  };

  return {
    elements: elements,
    params: params,
  };
};

export { makeLandscape };
