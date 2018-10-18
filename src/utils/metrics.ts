import { IVector2D } from './vectorUtils';

export const measureChebyshevDistanceRounded = (x: IVector2D, y: IVector2D) =>
	Math.round(Math.max(Math.abs(x[0] - y[0]), Math.abs(x[1] - y[1])));

export const measureManhattanDistanceRounded = (x: IVector2D, y: IVector2D) =>
	Math.round(Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]));

export const measureEuclideanDistanceRounded = (x: IVector2D, y: IVector2D) =>
	Math.round(Math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2));
