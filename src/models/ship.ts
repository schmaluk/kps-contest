import {
	addVec2Ds,
	IVector2D,
	multiplyVec2DByScalar,
	positionEqualsInPx,
	vec2DToVec2DInPx,
	subtractVec2Ds,
	vec2DLength,
	scalarProduct
} from '../utils/vectorUtils';
import { Station } from './station';

// Initial config for a new Ship instance passed to constructor:
export type IShipConfig = {
	position: IVector2D;
	shipSpeedPxPerMs: number;
};

// Signature of PxPositionChange-Handler for registering to a Ship-instance:
export type IPxPositionChangedHandler = (
	event: {
		eventName: 'PxPositionChanged';
		ship: Ship;
	}
) => void;

// Ship-Model:
export class Ship {
	// ship positional attributes:
	private currentPosition: IVector2D;
	private traveledDistance: number = 0;

	public lastStation: Station | null;
	public targetStation: Station | null;
	private rotationDegree: number = 0;
	public isMoving: boolean = false;

	private pxPositionChangedHandler: IPxPositionChangedHandler | null;
	private lastLoopUpdate: number | null;

	public constructor(private shipConfig: IShipConfig) {
		this.currentPosition = shipConfig.position;
	}

	private hasArrivedAtTargetStation() {
		return (
			this.targetStation &&
			positionEqualsInPx(this.targetStation.position, this.currentPosition)
		);
	}

	public loopUpdate(): void {
		const lastLoopUpdateOld = this.lastLoopUpdate;
		this.lastLoopUpdate = Date.now();

		const isFirstLoopExecution = !lastLoopUpdateOld;
		if (isFirstLoopExecution) {
			return;
		}

		const shipHasNoTargetStation = !this.targetStation;
		if (shipHasNoTargetStation) {
			return;
		}

		if (this.hasArrivedAtTargetStation()) {
			this.lastStation = this.targetStation;
			this.isMoving = false;
			const shipHasDocked =
				this.rotationDegree === this.targetStation.dockAngle;
			if (!shipHasDocked) {
				// Ship docks at station.ts:
				this.rotationDegree = this.targetStation.dockAngle;
			}
			this.pxPositionChangedHandler &&
				this.pxPositionChangedHandler({
					eventName: 'PxPositionChanged',
					ship: this
				});
			return;
		}

		// Calculate new Ship Position depending on elapsed time:
		this.isMoving = true;
		const oldPosition = this.currentPosition;
		const connectionVector = subtractVec2Ds(
			this.targetStation.position,
			oldPosition
		);
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

		// Update rotation degree:
		const cosAlpha = scalarProduct([-1, 0], normalizedDirectionVector);
		const alpha = (Math.acos(cosAlpha) / Math.PI) * 180;
		const rotationDegree = alpha >= 0 ? alpha : 180 - alpha;

		console.log('normalizedDirectionVector : ' + normalizedDirectionVector);
		console.log(
			'scalarProduct([0, 1], normalizedDirectionVector) : ' +
				scalarProduct([0, 1], normalizedDirectionVector)
		);
		const signum =
			scalarProduct([0, 1], normalizedDirectionVector) >= 0 ? -1 : 1;
		this.rotationDegree = signum * rotationDegree;
		console.log('rotationDegree : ' + rotationDegree);

		// Throw PxPositionChanged-Event in case px-position has changed:
		if (!positionEqualsInPx(newPosition, oldPosition)) {
			this.pxPositionChangedHandler &&
				this.pxPositionChangedHandler({
					eventName: 'PxPositionChanged',
					ship: this
				});
		}
	}

	public set onPxPositionChanged(
		pxPositionChangedHandler: IPxPositionChangedHandler
	) {
		this.pxPositionChangedHandler = pxPositionChangedHandler.bind(this);
		this.pxPositionChangedHandler({
			eventName: 'PxPositionChanged',
			ship: this
		});
	}

	public get currentPxPosition(): IVector2D {
		return vec2DToVec2DInPx(this.currentPosition);
	}

	public get traveledPxDistance(): number {
		return Math.floor(this.traveledDistance);
	}

	public get rotationDegreeFloored() {
		console.log('this.rotationDegree : ' + this.rotationDegree);
		return Math.floor(this.rotationDegree);
	}
}
