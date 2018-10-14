export type IVector2D = [number, number];

export const addPositions = (x: IVector2D, y: IVector2D): IVector2D => [
	x[0] + y[0],
	x[1] + y[1]
];

export const multiplyPositionByScalar = (
	x: IVector2D,
	s: number
): IVector2D => [s * x[0], s * x[1]];

export const subtractPositions = (x: IVector2D, y: IVector2D): IVector2D =>
	addPositions(x, multiplyPositionByScalar(y, -1));

export const vectorLength = (x: IVector2D): number =>
	Math.sqrt(x[0] ** 2 + x[1] ** 2);

export const normalizeLength = (x: IVector2D): IVector2D => {
	const factor = 1 / vectorLength(x);
	return [factor * x[0], factor * x[1]];
};

export const positionToPx = ([x, y]: IVector2D): [number, number] => [
	Math.floor(x),
	Math.floor(y)
];

export const positionEqualsInPx = (x: IVector2D, y: IVector2D): boolean => {
	const xInPx = positionToPx(x);
	const yInPx = positionToPx(y);
	return xInPx[0] === yInPx[0] && xInPx[1] === yInPx[1];
};
