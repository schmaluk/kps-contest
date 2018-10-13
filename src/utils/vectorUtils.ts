import { IPosition } from '../model/ship';

export const addPositions = (x: IPosition, y: IPosition): IPosition => [
	x[0] + y[0],
	x[1] + y[1]
];

export const multiplyPositionByScalar = (
	x: IPosition,
	s: number
): IPosition => [s * x[0], s * x[1]];

export const subtractPositions = (x: IPosition, y: IPosition): IPosition =>
	addPositions(x, multiplyPositionByScalar(y, -1));

export const vectorLength = (x: IPosition): number =>
	Math.sqrt(x[0] ** 2 + x[1] ** 2);

export const normalizeLength = (x: IPosition): IPosition => {
	const factor = 1 / vectorLength(x);
	return [factor * x[0], factor * x[1]];
};

export const positionToPx = ([x, y]: IPosition): [number, number] => [
	Math.floor(x),
	Math.floor(y)
];

export const positionEqualsInPx = (x: IPosition, y: IPosition): boolean => {
	const xInPx = positionToPx(x);
	const yInPx = positionToPx(y);
	return xInPx[0] === yInPx[0] && xInPx[1] === yInPx[1];
};
