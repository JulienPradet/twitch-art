import { CanvasJpDrawable, CanvasJpStrokeStyle } from "canvas-jp";
import { Circle } from "canvas-jp/Circle";
import { Color, Gradient, red, white } from "canvas-jp/Color";
import { CanvasJpFill, CanvasJpStroke } from "canvas-jp/draw";
import { CanvasJpPoint, CurvePoint, Point } from "canvas-jp/Point";
import { CanvasJpSharpShape, Shape, SmoothShape } from "canvas-jp/Shape";
import * as math from "canvas-sketch-util/math";
import { CarreauFactory, StyleParams } from "./styles";

export interface ArabesqueParams extends StyleParams {}

const background = Color(210 / 360, 0.45, 0.314);
const palette = [
  // Color(206 / 360, 0.5, 0.11),
  Color(214 / 360, 0.52, 0.5),
  Color(180 / 360, 0.1, 0.65),
  Color(5 / 360, 0.6, 0.93),
  Color(40 / 360, 0.66, 1),
  Color(37 / 360, 0.18, 0.99),
];

const makeArabesque: CarreauFactory<ArabesqueParams> = (
  pixel,
  shape,
  random,
  width,
  height,
  user
) => {
  let numberOfCircles = Math.round(random.value() * 4) * 2 + 3;
  if (numberOfCircles === 1 && random.value() < 0.7) {
    numberOfCircles = 9;
  }

  const shouldPatternBeFilled = random.value() > 0.5;
  const isMonochrome = random.value() > 0.9;
  const isGradient = isMonochrome && random.value() > 0.5;
  const isFloral = random.value() > 0.6;

  const makePattern = (
    center: CanvasJpPoint,
    patternRadius: number,
    stroke: CanvasJpStroke,
    fill: CanvasJpFill
  ): CanvasJpDrawable[] => {
    const perimeter = patternRadius * 2 * Math.PI;
    const minAngle = Math.PI / 4;
    const maxAngle = (Math.PI / 4) * 3;

    const angleFactor = (maxAngle - minAngle) / (Math.PI * 2);

    const strokeWidth = stroke.width;
    const circleRadius =
      (angleFactor * perimeter) / (numberOfCircles - 1) / 2 - strokeWidth / 2;

    const circles = new Array(numberOfCircles)
      .fill(null)
      .flatMap((_, index) => {
        const progress = index / (numberOfCircles - 1);
        const angle = math.mapRange(progress, 0, 1, minAngle, maxAngle);

        const circleAngleDiff = math.mapRange(
          circleRadius / perimeter,
          0,
          1,
          0,
          Math.PI * 2
        );

        const triangleStart = Point(
          center.x + patternRadius * Math.cos(angle - circleAngleDiff),
          center.y + patternRadius * Math.sin(angle - circleAngleDiff),
          0
        );
        const triangleEnd = Point(
          center.x + patternRadius * Math.cos(angle + circleAngleDiff),
          center.y + patternRadius * Math.sin(angle + circleAngleDiff),
          0
        );

        const triangleAnchor = isFloral
          ? Point(center.x, center.y + patternRadius * Math.sin(angle) * 0.75)
          : center;

        const circle = Circle(
          Point(
            center.x + patternRadius * Math.cos(angle),
            center.y + patternRadius * Math.sin(angle)
          ),
          circleRadius - pixel * 0.5,
          undefined,
          stroke
        );
        const triangle = SmoothShape(
          [
            triangleStart,
            CurvePoint(center.x, center.y, triangleAnchor, triangleAnchor),
            triangleEnd,
          ],
          0.3,
          undefined,
          stroke
        );

        const fillColor =
          fill.color.__type === "Gradient" ? fill.color.colors[1] : fill.color;

        return [
          circle,
          triangle,
          Circle(
            circle.center,
            circle.radius,
            { color: fillColor, opacity: 1 },
            undefined
          ),
          SmoothShape(triangle.points, 0.3, fill, undefined),
        ].filter(Boolean);
      });

    return circles;
  };

  const patternRadius = height / 6;
  const strokeWidth = math.mapRange(random.value(), 0, 1, 4, 10) * pixel;

  const rows = 9;
  const columns = 4;

  const phaseX = (random.value() - 0.5) * patternRadius;
  const patternCenters: CanvasJpPoint[] = [];
  for (let y = rows - 1; y >= -1; y--) {
    for (let x = 0; x < columns; x++) {
      patternCenters.push(
        Point(
          patternRadius * x + phaseX,
          (patternRadius / 3) * 2 * y + (x % 2 === 0 ? patternRadius / 3 : 0)
        )
      );
    }
  }

  patternCenters.sort((a, b) => {
    return b.y - a.y;
  });

  const baseColor = isMonochrome ? random.pick(palette) : null;
  const baseStrokeColor = isMonochrome
    ? random.pick(palette.filter((c) => c !== baseColor))
    : null;

  return {
    elements: new Array<CanvasJpDrawable>(
      Shape(shape.points, { color: background, opacity: 1 })
    ).concat(
      patternCenters
        .flatMap((point) => {
          const strokeColor = baseStrokeColor || random.pick(palette);

          let backgroundColor;
          if (shouldPatternBeFilled) {
            if (baseColor) {
              backgroundColor = baseColor;
            } else {
              backgroundColor = random.pick(
                palette.filter((c) => c !== strokeColor)
              );
            }

            if (isGradient) {
              backgroundColor = Gradient(
                [
                  random.pick(
                    palette.filter((c) => c !== baseColor && c !== strokeColor)
                  ),
                  backgroundColor,
                ],
                Math.PI / 2
              );
            }
          } else {
            backgroundColor = background;
          }

          return makePattern(
            point,
            patternRadius,
            {
              color: strokeColor,
              opacity: 1,
              width: strokeWidth,
              style: CanvasJpStrokeStyle.round,
            },
            {
              color: backgroundColor,
              opacity: 1,
            }
          );
        })
        .concat(
          [
            random.value() > 0.2
              ? Shape(
                  [
                    Point(width / 2, 0),
                    Point(width, height / 2),
                    Point(width / 2, height),
                    Point(0, height / 2),
                  ],
                  undefined,
                  {
                    color: random.pick(palette),
                    opacity: 1,
                    width: strokeWidth * 3,
                  }
                )
              : null,

            Shape(
              [
                Point(width / 2, 0),
                Point(width, height / 2),
                Point(width / 2, height),
                Point(0, height / 2),
              ],
              undefined,
              {
                color: random.pick(palette),
                opacity: 1,
                width: strokeWidth,
              }
            ),
          ].filter(Boolean) as CanvasJpSharpShape[]
        )
    ),
    params: {
      style: "Arabesque",
    },
  };
};

export default makeArabesque;
