import { CanvasJpDrawable, CanvasJpRandom } from "canvas-jp";
import { Polygon } from "canvas-jp/Polygon";
import { SmoothShape } from "canvas-jp/Shape";
import { CanvasJpPoint, Point } from "canvas-jp/Point";
import { black, Color, red, white } from "canvas-jp/Color";
import { CanvasJpShape } from "canvas-jp/Shape";
import { ClickRegion } from "canvas-jp/interaction";
import { getInBetween } from "canvas-jp/position";
import { distance } from "canvas-jp/distance";
import * as random from "canvas-sketch-util/random";
import * as math from "canvas-sketch-util/math";
import { TwitchUser } from "../../TwitchUser";
import { Line, SmoothLine } from "canvas-jp/Line";
import { rotate, translateVector } from "canvas-jp/transform";
import { Seed } from "canvas-jp/Seed";
import { Clip } from "canvas-jp/Clip";

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
  onClick?: () => void
): CanvasJpDrawable[] => {
  const makeClickRegion = (shape: CanvasJpShape, onClick: () => void) => {
    return ClickRegion(shape.points, onClick);
  };

  const wobblePoint = (
    position: CanvasJpPoint,
    strength: number
  ): CanvasJpPoint => {
    const angle = random.noise2D(position.x, position.y) * Math.PI * 2;
    const distance = (random.noise2D(position.x, position.y) + 0.5) * strength;

    return translateVector(distance, angle, position);
  };

  const wobbleLine = (
    start: CanvasJpPoint,
    end: CanvasJpPoint,
    strength = 1,
    numberOfPointsPerLine = 20
  ): CanvasJpPoint[] => {
    if (numberOfPointsPerLine <= 2) {
      return [wobblePoint(start, strength), wobblePoint(end, strength)];
    }
    return new Array(numberOfPointsPerLine).fill(null).map((_, index) => {
      const pointProgress = index / (numberOfPointsPerLine - 1);
      const position = getInBetween(start, end, pointProgress);
      return wobblePoint(position, strength);
    });
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
    style: null,
  });

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
          .concat(wobbleLine(bottom, left, strength, numberOfPointsPerLine))
          .concat(wobbleLine(left, top, strength, numberOfPointsPerLine))
          .concat(wobbleLine(top, right, strength, numberOfPointsPerLine))
          .concat(wobbleLine(right, bottom, strength, numberOfPointsPerLine));
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

  const elements: CanvasJpDrawable[] = shapes.concat(strilles);
  //   elements.push(shape);

  if (onClick) {
    elements.push(makeClickRegion(shape, onClick));
  }

  return [Clip(shape, elements)];
};

export const makeUserElements = (
  random: CanvasJpRandom,
  width: number,
  height: number,
  user: TwitchUser,
  onClick?: () => void
): CanvasJpDrawable[] => {
  return [
    Seed(Number(user.id), (random: CanvasJpRandom) => {
      return makeElements(random, width, height, user, onClick);
    }),
  ];
};
