import {
	addPositions,
	IVector2D,
	multiplyPositionByScalar,
	normalizeLength,
	positionEqualsInPx,
	positionToPx,
	subtractPositions
} from '../utils/vectorUtils';
import { IUpdatableModel } from './modelLoop';

// Initial config for a new Ship instance passed to constructor:
export type IShipCondig = {
	position: IVector2D;
	shipSpeedPxPerMs: number;
};

// Signature of PxPositionChange-Handler for registering to a Ship-instance:
export type IPxPositionChangedHandler = (
	event: {
		eventName: 'PxPositionChanged';
		oldPositionInPx: IVector2D;
		newPositionInPx: IVector2D;
	}
) => void;

// Ship-Model:
export class Ship implements IUpdatableModel {
	private currentPosition: IVector2D;
	private passedDistance: number = 0;
	private targetPosition: IVector2D | null;
	private pxPositionChangedHandler: IPxPositionChangedHandler | null;

	public constructor(private shipConfig: IShipCondig) {}

	public updateModel(elapsedTimeInMs: number): void {
		// Calculate new Position depending on elapsed time:
		const movedPx = elapsedTimeInMs * this.shipConfig.shipSpeedPxPerMs;
		const normalizedDirection: [number, number] = normalizeLength(
			subtractPositions(this.targetPosition, this.currentPosition)
		);
		const newPosition = addPositions(
			this.currentPosition,
			multiplyPositionByScalar(normalizedDirection, movedPx)
		);

		// Throw PxPositionChnaged-Event in case px-position has changed:
		if (!positionEqualsInPx(newPosition, this.currentPosition)) {
			this.pxPositionChangedHandler &&
				this.pxPositionChangedHandler({
					eventName: 'PxPositionChanged',
					oldPositionInPx: positionToPx(this.currentPosition),
					newPositionInPx: positionToPx(newPosition)
				});
		}

		// Update to new position:
		this.currentPosition = newPosition;
	}

	public set onPxPositionChanged(
		pxPositionChangedHandler: IPxPositionChangedHandler
	) {
		this.pxPositionChangedHandler = pxPositionChangedHandler;
	}

	public set target(targetPosition: IVector2D) {
		this.targetPosition = targetPosition;
	}

	public get currentPxPosition(): IVector2D {
		return positionToPx(this.currentPosition);
	}

	public get movedPxDistance(): number {
		return Math.floor(this.passedDistance);
	}

	public get isPxMoving(): boolean {
		return !positionEqualsInPx(this.currentPosition, this.targetPosition);
	}
}
