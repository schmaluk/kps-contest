import {
	IVector2D,
	multiplyVec2DByScalar,
	subtractVec2Ds
} from '../utils/vectorUtils';

export class LakeView {
	// Html-View-Elements:
	private boat: HTMLElement;
	private readonly boatDimensions: IVector2D;

	private lake: HTMLElement = document.querySelector('#lake');

	constructor() {
		this.boat = document.querySelector('#boat');
		this.boatDimensions = [this.boat.clientWidth, this.boat.clientHeight];
		this.boat.style.position = 'absolute';
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
		console.log('rotationValue : ' + rotationValue);
		this.boat.style.transform = rotationValue;
		this.boat.style.webkitTransform = rotationValue;
	}

	public setBoatOnLake(args: { position: IVector2D; rotationDegree?: number }) {
		//newBoatPosition = [200, 200];
		this.setBoatPosition(args.position);
		const degree = args.rotationDegree || 0;
		this.setBoatRotation(degree);
	}
}
