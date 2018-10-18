import {
	IVector2D,
	multiplyVec2DByScalar,
	subtractVec2Ds
} from '../utils/vectorUtils';

export class LakeMap {
	// Referencing Html-View-Elements:
	private boat: HTMLElement;
	private lake: HTMLElement = document.querySelector('#lake');

	// Save boat dimensions: width & height
	private readonly boatDimensions: IVector2D;

	constructor() {
		this.boat = document.querySelector('#boat');
		this.boatDimensions = [this.boat.clientWidth, this.boat.clientHeight];
		this.boat.style.position = 'absolute';
		this.boat.style.zIndex = '1000';
		this.lake.style.position = 'relative';
	}

	private setBoatPosition(position: IVector2D) {
		const boatCenter: IVector2D = multiplyVec2DByScalar(
			0.5,
			this.boatDimensions
		);
		const boatTranslationVector: IVector2D = subtractVec2Ds(
			position,
			boatCenter
		);

		this.boat.style.left = boatTranslationVector[0].toString(10) + 'px';
		this.boat.style.top = boatTranslationVector[1].toString(10) + 'px';
	}

	private setBoatRotation(degree: number) {
		const rotationValue = `rotate(${degree.toString(10)}deg)`;
		this.boat.style.transform = rotationValue;
		this.boat.style.webkitTransform = rotationValue;
	}

	public placeBoatOnLake(args: {
		position: IVector2D;
		rotationAngle?: number;
	}) {
		this.setBoatPosition(args.position);
		const degree = args.rotationAngle || 0;
		this.setBoatRotation(degree);
	}
}
