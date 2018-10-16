import {
	addVec2Ds,
	IVector2D,
	multiplyVec2DByScalar,
	vec2DRoundedEquals,
	roundVec2D,
	subtractVec2Ds,
	vec2DLength,
	vec2DScalarProduct
} from '../utils/vectorUtils';
import { Station } from './station';

// Initial config for a new Ship instance passed to constructor:
export type IShipConfig = {
	position: IVector2D;
	shipSpeedPxPerMs: number;
};

// Signature of PxPositionChange-Handler for registering to a Ship-instance:
export type IShipPositionChangedHandler = (
	event: {
		ship: Ship;
	}
) => void;

// Ship-Model:
export class Ship {
	// ship's state:
	private currentPosition: IVector2D;
	private traveledDistance: number = 0;

	private targetStation: Station | null;
	private lastStation: Station | null;

	private rotationDegree: number = 0;

	// Could be derived but included here for simplicity:
	public isMoving: boolean = false;

	// EventHandler fired when ship's position has changed:
	private onPositionChanged: IShipPositionChangedHandler | null;

	// timestamp of last update of ship's position:
	private lastUpdateTimestamp: number | null;

	public constructor(private shipConfig: IShipConfig) {
		// Save ship's configuration: speed etc.
		this.currentPosition = shipConfig.position;
	}

	// Helper method: Checks, if ship has arrived at targetStation:
	private hasArrivedAtTargetStation(): boolean {
		return (
			this.targetStation &&
			vec2DRoundedEquals(this.targetStation.position, this.currentPosition)
		);
	}

	// Periodically called in order tu update ship's position:
	public updatePosition(): void {
		// Update timestamp:
		const lastUpdateTimestampOld = this.lastUpdateTimestamp;
		this.lastUpdateTimestamp = Date.now();

		// Upon 1st update call the ship's position change missing timestamp:
		// Skip position update
		const isFirstUpdate = !lastUpdateTimestampOld;
		if (isFirstUpdate) {
			return;
		}

		// When a target station has not been set yet:
		// Skip position update
		const shipHasNoTargetStation = !this.targetStation;
		if (shipHasNoTargetStation) {
			return;
		}

		// When a ship has arrived at target station:
		// Skip position update but initiate dock process
		if (this.hasArrivedAtTargetStation()) {
			this.lastStation = this.targetStation;
			this.isMoving = false;
			const shipHasDocked =
				this.rotationDegree === this.targetStation.dockAngle;
			if (!shipHasDocked) {
				// Rotate Ship for docking:
				this.rotationDegree = this.targetStation.dockAngle;
				// Throw Event:
				this.onPositionChanged && this.onPositionChanged({ ship: this });
			}
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
		const elapsedTimeInMs = this.lastUpdateTimestamp - lastUpdateTimestampOld;
		const movedPx = Math.min(
			distanceToTarget,
			elapsedTimeInMs * this.shipConfig.shipSpeedPxPerMs
		);
		const normalizedDirectionVector: [number, number] = multiplyVec2DByScalar(
			1 / distanceToTarget,
			connectionVector
		);
		const newPosition = addVec2Ds(
			oldPosition,
			multiplyVec2DByScalar(movedPx, normalizedDirectionVector)
		);

		// Update to new position:
		this.currentPosition = newPosition;

		// Update traveled distance:
		this.traveledDistance += movedPx;

		// Update rotation degree:
		const cosAlpha = vec2DScalarProduct([-1, 0], normalizedDirectionVector);
		const alpha = (Math.acos(cosAlpha) / Math.PI) * 180;
		const rotationDegree = alpha >= 0 ? alpha : 180 - alpha;
		// Calculate signum for rotation: + or - aka 1 or -1
		const signum =
			vec2DScalarProduct([0, 1], normalizedDirectionVector) >= 0 ? -1 : 1;
		this.rotationDegree = signum * rotationDegree;

		// Throw PxPositionChanged-Event in case px-position has changed:
		if (!vec2DRoundedEquals(newPosition, oldPosition)) {
			this.onPositionChanged &&
				this.onPositionChanged({
					ship: this
				});
		}
	}

	public setOnPositionChangedHandler(
		onPositionChangedHandler: IShipPositionChangedHandler
	) {
		this.onPositionChanged = onPositionChangedHandler.bind(this);
		// Throw Event after setting Handler:
		this.onPositionChanged({
			ship: this
		});
	}

	public setTargetStation(targetStation: Station) {
		this.targetStation = targetStation;
	}

	public getLastStation(): Station {
		return this.lastStation;
	}

	public get currentPositionInPx(): IVector2D {
		return roundVec2D(this.currentPosition);
	}

	public get traveledDistanceInPx(): number {
		return Math.round(this.traveledDistance);
	}

	public get rotationDegreeRounded() {
		return Math.round(this.rotationDegree);
	}
}
