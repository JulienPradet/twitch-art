import { CanvasJpDrawable } from "canvas-jp";
import { SmoothShape } from "canvas-jp/Shape";
import { CanvasJpPoint, Point } from "canvas-jp/Point";
import { Color, white } from "canvas-jp/Color";
import { CanvasJpShape } from "canvas-jp/Shape";
import { ClickRegion } from "canvas-jp/interaction";
import { distance } from "canvas-jp/distance";
import * as math from "canvas-sketch-util/math";
import { SmoothLine } from "canvas-jp/Line";
import { rotate } from "canvas-jp/transform";
import { CarreauFactory, StyleParams } from "./styles";
import { wobbleLine } from "./wobble";

export interface HaloParams extends StyleParams {}

const palette = [
  // Color(206 / 360, 0.5, 0.11),
  Color(214 / 360, 0.52, 0.5),
  Color(180 / 360, 0.1, 0.65),
  Color(5 / 360, 0.6, 0.93),
  Color(40 / 360, 0.66, 1),
  Color(37 / 360, 0.18, 0.99),
];

const makeHalo: CarreauFactory<HaloParams> = (
  pixel,
  shape,
  random,
  width,
  height,
  user
) => {
  const numberOfShapes = Math.round(random.value() * 7 + 1);

  let latestProgress: number = 0;
  const distanceFromCenter = (
    maxDistance: number,
    center: number,
    progress: number
  ) => {
    return center + maxDistance * progress;
  };
  const shapes: CanvasJpDrawable[] = new Array(numberOfShapes)
    .fill(null)
    .map((_, index) => {
      let progress = (index + 1) / numberOfShapes;
      progress = math.clamp(
        progress * progress + random.value() * (0.5 - 0.25),
        0,
        1
      );

      const color = palette[Math.floor(random.value() * palette.length)];

      const makePoints = (
        progress: number,
        offset: number = 0
      ): CanvasJpPoint[] => {
        const ratio = width / height;
        const bottom = Point(
          width / 2,
          distanceFromCenter(-height / 2, height / 2, progress) - offset
        );
        const left = Point(
          distanceFromCenter(-width / 2, width / 2, progress) - offset * ratio,
          height / 2
        );
        const top = Point(
          width / 2,
          distanceFromCenter(height / 2, height / 2, progress) + offset
        );
        const right = Point(
          distanceFromCenter(width / 2, width / 2, progress) + offset * ratio,
          height / 2
        );
        const numberOfPointsPerLine = Math.round(
          distance(bottom, left) / (50 * pixel)
        );
        const strength = pixel * 0.5;

        return ([] as CanvasJpPoint[])
          .concat(
            wobbleLine(random, bottom, left, strength, numberOfPointsPerLine)
          )
          .concat(
            wobbleLine(random, left, top, strength, numberOfPointsPerLine)
          )
          .concat(
            wobbleLine(random, top, right, strength, numberOfPointsPerLine)
          )
          .concat(
            wobbleLine(random, right, bottom, strength, numberOfPointsPerLine)
          );
      };

      const outerPoints = makePoints(progress);
      const innerPoints = makePoints(latestProgress, 20 * pixel).reverse();

      const shape = SmoothShape(
        outerPoints
          .concat([outerPoints[outerPoints.length - 1], innerPoints[0]])
          .concat(innerPoints),
        0.3,
        {
          color: color,
          opacity: 1,
        }
      );

      latestProgress = progress;

      return shape;
    });
  const strilleQuantity = random.value() * 15 + 1;
  const opacityRandomness =
    (1 / strilleQuantity) * (random.value() * 0.6 + 0.4);
  const strilleWobbliness = random.value() * 8;
  const numberOfStrilles = Math.round(
    (height / pixel / 5) * 1.3 * (random.value() * 10 + 1)
  );
  const strilleWidth = 0.5 * pixel;
  const strilleAngle = random.value() * Math.PI;
  const center = Point(width / 2, height / 2);
  const strilles: CanvasJpDrawable[] = new Array(numberOfStrilles)
    .fill(null)
    .map((_, index) => {
      const progress = (index / numberOfStrilles) * 1.3;

      const start = Point(width / 2 - height / 2, height * progress + 0.5);
      const end = Point(width / 2 + height / 2, height * progress + 0.5);
      const rotatedStart = rotate(center, strilleAngle, start);
      const rotatedEnd = rotate(center, strilleAngle, end);

      return SmoothLine(
        wobbleLine(
          random,
          rotatedStart,
          rotatedEnd,
          strilleWobbliness,
          Math.round(20 * pixel)
        ),
        0.3,
        {
          color: white,
          opacity: random.value() * 0.6 * opacityRandomness + 0.1,
          style: null,
          width: strilleWidth,
        }
      );
    });

  const params: HaloParams = {
    style: "Halo",
  };

  return {
    elements: shapes.concat(strilles),
    params: params,
  };
};

export { makeHalo };
