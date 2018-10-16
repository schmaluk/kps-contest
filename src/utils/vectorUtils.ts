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

export const normalizeVec2D = (x: IVector2D): IVector2D => {
	const factor = 1 / vec2DLength(x);
	return multiplyVec2DByScalar(factor, x);
};

export const vec2DToVec2DInPx = ([x, y]: IVector2D): IVector2D => [
	Math.round(x),
	Math.round(y)
];

export const positionEqualsInPx = (x: IVector2D, y: IVector2D): boolean => {
	const xInPx = vec2DToVec2DInPx(x);
	const yInPx = vec2DToVec2DInPx(y);
	console.log('xInPx : ' + xInPx);
	console.log('yInPx : ' + yInPx);
	return xInPx[0] === yInPx[0] && xInPx[1] === yInPx[1];
};

export const scalarProduct = (x: IVector2D, y: IVector2D) => {
	return x[0] * y[0] + x[1] * y[1];
};

export const calcDegreeBetweenVec2Ds = (x: IVector2D, y: IVector2D) => {
	const cosAlpha = scalarProduct(x, y) / (vec2DLength(x) * vec2DLength(y));
	const alpha = Math.acos(cosAlpha);
	// Check, if degree between x and y should be positive or negative:
	const xRotated90Degree: IVector2D = [x[1], -x[0]];
	if (scalarProduct(xRotated90Degree, y) > 0) {
		// y is a vector between x and xRotated90Degree:
		// -> x needs to be rotated with a negative degree to get y:
		return alpha;
	} else {
		// -> x needs to be rotated with a positive degree to get y:
		return -alpha;
	}
};
