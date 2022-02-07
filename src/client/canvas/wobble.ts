import { CanvasJpRandom } from "canvas-jp";
import { CanvasJpPoint } from "canvas-jp/Point";
import { getBezierAt, getInBetween } from "canvas-jp/position";
import { translateVector } from "canvas-jp/transform";

export const wobblePoint = (
  random: CanvasJpRandom,
  position: CanvasJpPoint,
  strength: number
): CanvasJpPoint => {
  const angle = random.noise2D(position.x, position.y) * Math.PI * 2;
  const distance = (random.noise2D(position.x, position.y) + 0.5) * strength;

  return translateVector(distance, angle, position);
};

export const wobbleLine = (
  random: CanvasJpRandom,
  start: CanvasJpPoint,
  end: CanvasJpPoint,
  strength = 1,
  numberOfPointsPerLine = 20
): CanvasJpPoint[] => {
  if (numberOfPointsPerLine <= 2) {
    return [
      wobblePoint(random, start, strength),
      wobblePoint(random, end, strength),
    ];
  }

  const startControl =
    start.__type === "CurvePoint" ? start.nextControl : start;
  const endControl = end.__type === "CurvePoint" ? end.prevControl : end;

  return new Array(numberOfPointsPerLine).fill(null).map((_, index) => {
    const pointProgress = index / (numberOfPointsPerLine - 1);
    const position = getBezierAt(
      start,
      end,
      startControl,
      endControl,
      pointProgress
    );
    return wobblePoint(random, position, strength);
  });
};
