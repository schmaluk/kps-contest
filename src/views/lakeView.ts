import {
	IVector2D,
	multiplyVec2DByScalar,
	subtractVec2Ds
} from '../utils/vectorUtils';

export class LakeView {
	// Html-View-Elements:
	private boat: HTMLElement;
	private boatDimensions: IVector2D;

	private lake: HTMLElement = document.querySelector('#lake');

	constructor() {
		this.boat = document.querySelector('#boat');
		this.boatDimensions = [this.boat.clientWidth, this.boat.clientHeight];
		this.boat.style.position = 'absolute';
		this.lake.style.position = 'relative';
	}

	public setBoatPositionOnLake(newBoatPosition: IVector2D) {
		//newBoatPosition = [200, 200];
		console.log('this.boatDimensions : ' + this.boatDimensions);
		console.log('setBoatPositionOnLake : ' + newBoatPosition);
		const boatCenter: IVector2D = multiplyVec2DByScalar(
			0.5,
			this.boatDimensions
		);
		const boatTranslationVector: IVector2D = subtractVec2Ds(
			newBoatPosition,
			boatCenter
		);

		this.boat.style.left = boatTranslationVector[0].toString(10) + 'px';
		this.boat.style.top = boatTranslationVector[1].toString(10) + 'px';
		console.log('this.boat.style.left : ' + this.boat.style.left);
		console.log('this.boat.style.top : ' + this.boat.style.top);
		console.log(
			'this.boat.style.left : ' + boatTranslationVector[0].toString(10) + 'px'
		);
		console.log('this.boat.style.top : ' + this.boat.style.top);
	}
}
