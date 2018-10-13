import { config } from '../config';
import {
	addPositions,
	multiplyPositionByScalar,
	normalizeLength,
	positionEqualsInPx,
	positionToPx,
	subtractPositions
} from '../utils/vectorUtils';

export type IPosition = [number, number];

export enum Station {
	A,
	B,
	C,
	D
}

export class Ship {
	private currentPosition: IPosition;
	private passedDistance: number = 0;
	private targetPosition: IPosition | null;
	private lastStation: Station | null = null;

	public constructor() {
		this.currentPosition = config.INITIAL_SHIP_POSITION;
	}

	public updateModel(elapsedTimeInMs: number): void {
		const movedPx = elapsedTimeInMs * config.SHIP_SPEED_PX_PER_MS;
		const normalizedDirection: [number, number] = normalizeLength(
			subtractPositions(this.targetPosition, this.currentPosition)
		);
		this.currentPosition = addPositions(
			this.currentPosition,
			multiplyPositionByScalar(normalizedDirection, movedPx)
		);
	}

	public changeTargetStation(targetStation: Station): void {
		switch (targetStation) {
			case Station.A:
				this.targetPosition = config.STATION_A_POSITION;
				break;
			case Station.B:
				this.targetPosition = config.STATION_B_POSITION;
				break;
			case Station.C:
				this.targetPosition = config.STATION_C_POSITION;
				break;
			case Station.D:
				this.targetPosition = config.STATION_D_POSITION;
				break;
		}
	}

	public get currentPositionInPx(): IPosition {
		return positionToPx(this.currentPosition);
	}

	public get movedDistanceInPx(): number {
		return Math.floor(this.passedDistance);
	}

	public get isMoving(): boolean {
		return !positionEqualsInPx(this.currentPosition, this.targetPosition);
	}
}
