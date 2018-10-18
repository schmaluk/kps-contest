import { IVector2D } from './vectorUtils';

export const measureChebyshevDistance = (x: IVector2D, y: IVector2D) =>
	Math.max(Math.abs(x[0] - y[0]), Math.abs(x[1] - y[1]));

export const measureManhattanDistance = (x: IVector2D, y: IVector2D) =>
	Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]);

export const measureEuclideanDistance = (x: IVector2D, y: IVector2D) =>
	Math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2);
