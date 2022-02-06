declare module "canvas-sketch-util/random" {
  export const getRandomSeed: () => number;
  export const setSeed: (n: number) => void;
  export const getSeed: () => number;
  export const value: () => number;
  export const noise2D: (
    x: number,
    y: number,
    frequency?: number,
    amplitude?: number
  ) => number;
}
declare module "canvas-sketch-util/math" {
  export const clamp: (value: number, min: number, max: number) => number;
}
