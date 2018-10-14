import {
	addVec2Ds,
	IVector2D,
	multiplyVec2DByScalar,
	normalizeVec2D,
	positionEqualsInPx,
	vec2DToVec2DInPx,
	subtractVec2Ds,
	vec2DLength
} from '../utils/vectorUtils';
import { ILoopable } from '../index';

// Initial config for a new Ship instance passed to constructor:
export type IShipConfig = {
	position: IVector2D;
	shipSpeedPxPerMs: number;
};

// Signature of PxPositionChange-Handler for registering to a Ship-instance:
export type IPxPositionChangedHandler = (
	event: {
		eventName: 'PxPositionChanged';
		kpsShip: Ship;
	}
) => void;

// Ship-Model:
export class Ship implements ILoopable {
	private currentPosition: IVector2D;
	private traveledDistance: number = 0;
	private targetPosition: IVector2D | null;
	private pxPositionChangedHandler: IPxPositionChangedHandler | null;
	private lastLoopUpdate: number | null;

	public constructor(private shipConfig: IShipConfig) {
		this.currentPosition = shipConfig.position;
	}

	public loopUpdate(): void {
		const lastLoopUpdateOld = this.lastLoopUpdate;
		this.lastLoopUpdate = Date.now();

		const isFirstLoopExecution = !lastLoopUpdateOld;
		if (isFirstLoopExecution) {
			return;
		}

		const shipHasNoTarget = !this.targetPosition;
		if (shipHasNoTarget) {
			return;
		}

		const shipHasArrivedToTarget = positionEqualsInPx(
			this.targetPosition,
			this.currentPosition
		);
		if (shipHasArrivedToTarget) {
			return;
		}

		// Calculate new Position depending on elapsed time:
		const oldPosition = this.currentPosition;
		const connectionVector = subtractVec2Ds(this.targetPosition, oldPosition);
		const distanceToTarget = vec2DLength(connectionVector);

		console.log('Calculate new Position depending on elapsed time');
		const elapsedTimeInMs = this.lastLoopUpdate - lastLoopUpdateOld;
		const movedPx = Math.min(
			distanceToTarget,
			elapsedTimeInMs * this.shipConfig.shipSpeedPxPerMs
		);
		const normalizedDirectionVector: [number, number] = multiplyVec2DByScalar(
			1 / distanceToTarget,
			connectionVector
		);
		console.log('movedPx : ' + movedPx);
		console.log('normalizedDirectionVector : ' + normalizedDirectionVector);

		const newPosition = addVec2Ds(
			oldPosition,
			multiplyVec2DByScalar(movedPx, normalizedDirectionVector)
		);

		// Update to new position:
		this.currentPosition = newPosition;

		// Update traveled distance:
		this.traveledDistance += movedPx;

		// Throw PxPositionChanged-Event in case px-position has changed:
		if (!positionEqualsInPx(newPosition, oldPosition)) {
			this.pxPositionChangedHandler &&
				this.pxPositionChangedHandler({
					eventName: 'PxPositionChanged',
					kpsShip: this
				});
		}
	}

	public set onPxPositionChanged(
		pxPositionChangedHandler: IPxPositionChangedHandler
	) {
		this.pxPositionChangedHandler = pxPositionChangedHandler;
		this.pxPositionChangedHandler.bind(this);
	}

	public set target(targetPosition: IVector2D) {
		this.targetPosition = targetPosition;
	}

	public get currentPxPosition(): IVector2D {
		return vec2DToVec2DInPx(this.currentPosition);
	}

	public get traveledPxDistance(): number {
		return Math.floor(this.traveledDistance);
	}

	public get isPxMoving(): boolean {
		console.log(this.currentPosition);
		console.log(this.targetPosition);
		console.log(
			'isPxMoving : ' +
				!positionEqualsInPx(this.currentPosition, this.targetPosition)
		);
		return !positionEqualsInPx(this.currentPosition, this.targetPosition);
	}
}
