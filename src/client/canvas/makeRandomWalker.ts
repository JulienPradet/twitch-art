import { CanvasJpDrawable, CanvasJpStrokeStyle } from "canvas-jp";
import { SmoothShape } from "canvas-jp/Shape";
import { CanvasJpPoint, Point } from "canvas-jp/Point";
import { Color, Gradient, red, white } from "canvas-jp/Color";
import { CanvasJpShape } from "canvas-jp/Shape";
import { ClickRegion } from "canvas-jp/interaction";
import { distance } from "canvas-jp/distance";
import * as math from "canvas-sketch-util/math";
import { Line, SmoothLine } from "canvas-jp/Line";
import { rotate } from "canvas-jp/transform";
import { CarreauFactory, StyleParams } from "./styles";
import { wobbleLine } from "./wobble";
import { Circle } from "canvas-jp/Circle";

export interface RandomWalkerParams extends StyleParams {}

const palette = [
  // Color(206 / 360, 0.5, 0.11),
  Color(214 / 360, 0.52, 0.5),
  Color(180 / 360, 0.1, 0.65),
  Color(5 / 360, 0.6, 0.93),
  Color(40 / 360, 0.66, 1),
  Color(37 / 360, 0.18, 0.99),
];

const makeRandomWalker: CarreauFactory<RandomWalkerParams> = (
  pixel,
  shape,
  random,
  width,
  height,
  user
) => {
  const params: RandomWalkerParams = {
    style: "Random Walker",
  };

  const rows = Math.round(random.value() * 5 + 10);
  const columns = rows;
  const initialPosition = Point(width / 2, 0);

  const marginWidth = width / 10;
  const marginHeight = height / 10;
  const innerWidth = (width - marginWidth * 2) / 2;
  const innerHeight = (height - marginHeight * 2) / 2;

  const xAxisVector = Point(innerWidth, innerHeight);
  const yAxisVector = Point(-innerWidth, innerHeight);

  const maxDistance = Math.sqrt(
    Math.pow(innerWidth, 2) + Math.pow(innerHeight, 2)
  );
  const strokeWidth = (maxDistance / rows) * (0.25 + random.value() * 0.5);
  const strokeStyle = CanvasJpStrokeStyle.square;

  const gradientAngle = random.value() * Math.PI;
  const gradient = Gradient(
    [random.pick(palette), random.pick(palette)],
    gradientAngle
  );

  const grid = new Array(rows).fill(null).map((_, y) => {
    const progressY = y / (rows - 1);
    return new Array(columns).fill(null).map((_, x) => {
      const progressX = x / (columns - 1);
      return Point(
        initialPosition.x +
          progressX * xAxisVector.x +
          progressY * yAxisVector.x,
        initialPosition.y +
          progressX * xAxisVector.y +
          progressY * yAxisVector.y +
          marginHeight
      );
    });
  });

  const projectOnGrid = ({ x, y }: CanvasJpPoint) => {
    return Point(grid[x][y].x + 0, grid[x][y].y);
  };

  const occupiedPoints = new Array(rows).fill(null).map((_, y) => {
    return new Array(columns).fill(null).map((_, x) => {
      return random.value() < 0.2;
    });
  });

  const isOccupied = (point: CanvasJpPoint) => {
    const isOutsideGrid =
      point.x >= rows || point.x < 0 || point.y >= columns || point.y < 0;
    return isOutsideGrid || occupiedPoints[point.x][point.y];
  };

  const addPointToList = (point: CanvasJpPoint) => {
    listPoints.push(point);
    occupiedPoints[point.x][point.y] = true;
  };

  const moveOptions = [Point(0, 1), Point(1, 0), Point(0, -1), Point(-1, 0)];
  const move = (point: CanvasJpPoint): CanvasJpPoint | null => {
    const shuffledMoveOptions = random.shuffle(moveOptions);
    let i = 0;
    while (i < shuffledMoveOptions.length) {
      const selectedOption = shuffledMoveOptions[i];
      const pointCandidate = Point(
        point.x + selectedOption.x,
        point.y + selectedOption.y
      );
      if (!isOccupied(pointCandidate)) {
        return pointCandidate;
      }

      i++;
    }

    return null;
  };

  const findLastPointThatCanStillMove = () => {
    for (let j = listWalkers.length - 1; j >= 0; j--) {
      let listPoints = listWalkers[j];
      for (let i = listPoints.length - 1; i >= 0; i--) {
        if (move(listPoints[i]) !== null) {
          return listPoints[i];
        }
      }
    }

    return null;
  };

  const initialPoint = Point(
    Math.floor(random.value() * rows),
    Math.floor(random.value() * columns)
  );

  const listWalkers = new Array<CanvasJpPoint[]>();
  let listPoints = new Array<CanvasJpPoint>();
  addPointToList(initialPoint);
  let currentPoint: CanvasJpPoint | null = initialPoint;
  while (currentPoint !== null) {
    currentPoint = move(currentPoint);
    if (currentPoint === null) {
      listWalkers.push(listPoints);
      currentPoint = findLastPointThatCanStillMove();
      console.log("lastPointCandidate", currentPoint);
      if (currentPoint) {
        listPoints = [currentPoint];
      }
    } else {
      addPointToList(currentPoint);
    }
  }

  const circles = grid.flatMap((row) =>
    row.map((position) => {
      return Circle(position, 0.25, { color: white, opacity: 1 });
    })
  );

  const walkers = listWalkers
    .filter((listPoints) => {
      return random.value() > 0.2 && listPoints.length > 0;
    })
    .map((listPoints) =>
      SmoothLine(listPoints.map(projectOnGrid), 0, {
        color: gradient,
        opacity: 1,
        width: strokeWidth,
        style: strokeStyle,
      })
    );

  const endPoints = listWalkers.map((listPoints) => {
    const lastPoint = listPoints[listPoints.length - 1];

    return Circle(projectOnGrid(lastPoint), 3, { color: white, opacity: 1 });
  });

  return {
    elements: new Array<CanvasJpDrawable>().concat(circles).concat(walkers),
    params: params,
  };
};

export { makeRandomWalker };
