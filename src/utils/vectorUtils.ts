export type IVector2D = [number, number];

export const addVec2Ds = (x: IVector2D, y: IVector2D): IVector2D => [
	x[0] + y[0],
	x[1] + y[1]
];

export const multiplyVec2DByScalar = (s, x): IVector2D => [s * x[0], s * x[1]];

export const subtractVec2Ds = (x: IVector2D, y: IVector2D): IVector2D =>
	addVec2Ds(x, multiplyVec2DByScalar(-1, y));

export const vec2DLength = (x: IVector2D): number =>
	Math.sqrt(x[0] ** 2 + x[1] ** 2);

export const floorVec2D = ([x, y]: IVector2D): IVector2D => [
	Math.round(x),
	Math.round(y)
];

export const vec2DEquals = (x: IVector2D, y: IVector2D): boolean => {
	return x[0] === y[0] && x[1] === y[1];
};

export const vec2DScalarProduct = (x: IVector2D, y: IVector2D) => {
	return x[0] * y[0] + x[1] * y[1];
};

export const distanceBetweenVec2Ds = (x: IVector2D, y: IVector2D) => {
	const connectionVector = subtractVec2Ds(x, y);
	return vec2DLength(connectionVector);
};
