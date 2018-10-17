import {
	addVec2Ds,
	IVector2D,
	multiplyVec2DByScalar,
	vec2DEquals,
	floorVec2D,
	subtractVec2Ds,
	vec2DLength,
	vec2DScalarProduct,
	distanceBetweenVec2Ds
} from '../utils/vectorUtils';
import { Station } from './station';

// Initial config for a new Ship instance passed to constructor:
export type IShipConfig = {
	position: IVector2D;
	shipSpeedPxPerMs: number;
};

// Signature of PxPositionChange-Handler for registering to a Ship-instance:
export type IPositionUpdatedHandler = (
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

	// EventHandler fired when ship's position has been updated:
	private onPositionUpdated: IPositionUpdatedHandler | null;

	// timestamp of last update of ship's position:
	private lastRequestTimestamp: number | null;

	public constructor(private shipConfig: IShipConfig) {
		// Save ship's configuration: speed etc.
		this.currentPosition = shipConfig.position;
	}

	// Checks, if we should update the current position of the ship:
	private shouldMove(): boolean {
		// Upon 1st update call the ship's position change missing timestamp:
		// Skip position update
		const isFirstUpdate = !this.lastRequestTimestamp;
		if (isFirstUpdate) {
			return false;
		}

		// When a target station has not been set yet:
		// Skip position update
		const shipHasNoTargetStation = !this.targetStation;
		if (shipHasNoTargetStation) {
			return false;
		}

		// Ship has already arrived at target station:
		// Skip position update
		const shipHasArrivedAtTargetStation = vec2DEquals(
			this.currentPosition,
			this.targetStation.position
		);
		if (shipHasArrivedAtTargetStation) {
			return false;
		}

		return true;
	}

	private dockToTargetStation(): void {
		this.currentPosition = this.targetStation.position;
		// Rotate Ship for docking:
		this.rotationDegree = this.targetStation.dockAngle;
		this.isMoving = false;
		this.lastStation = this.targetStation;
	}

	private moveToTargetStationDirection(distanceToMove: number): void {
		const connection = subtractVec2Ds(
			this.targetStation.position,
			this.currentPosition
		);
		const normalizedDirection = multiplyVec2DByScalar(
			1 / vec2DLength(connection),
			connection
		);

		const newPosition = addVec2Ds(
			this.currentPosition,
			multiplyVec2DByScalar(distanceToMove, normalizedDirection)
		);
		// Update currentPosition:
		this.currentPosition = newPosition;
		this.isMoving = true;

		// Update rotation degree:
		const cosAlpha = vec2DScalarProduct([-1, 0], normalizedDirection);
		const alpha = (Math.acos(cosAlpha) / Math.PI) * 180;
		const rotationDegree = alpha >= 0 ? alpha : 180 - alpha;
		// Calculate signum for rotation: + or - aka 1 or -1
		const signum =
			vec2DScalarProduct([0, 1], normalizedDirection) >= 0 ? -1 : 1;
		this.rotationDegree = signum * rotationDegree;
	}

	// Updates the currentPosition depending on elapsedTime and speed:
	private moveShip(elapsedTimeInMs: number) {
		// moveDistance is the distance the ship can move within this step:
		const moveDistance = elapsedTimeInMs * this.shipConfig.shipSpeedPxPerMs;

		const distanceToTarget = distanceBetweenVec2Ds(
			this.targetStation.position,
			this.currentPosition
		);

		// Check, if the ship can reach the targetStation during this update:
		if (distanceToTarget < moveDistance) {
			// Target is within reachable distance during this update:
			this.dockToTargetStation();
			this.traveledDistance += distanceToTarget;
		} else {
			// Target is not yet reachable during this update:
			// But move the ship into this direction:
			this.moveToTargetStationDirection(moveDistance);
			this.traveledDistance += moveDistance;
		}

		// Throw PositionUpdated-Event:
		this.onPositionUpdated &&
			this.onPositionUpdated({
				ship: this
			});
	}

	// Periodically called in order tu update ship's position:
	public requestMove(): void {
		const now = Date.now();
		const elapsedTimeInMs = now - this.lastRequestTimestamp;

		// Check, if any update to currentPosition is required:
		const shouldMove = this.shouldMove();

		if (shouldMove) {
			this.moveShip(elapsedTimeInMs);
		}

		// Update timestamp:
		this.lastRequestTimestamp = now;
	}

	public setOnPositionChangedHandler(
		onPositionChangedHandler: IPositionUpdatedHandler
	) {
		this.onPositionUpdated = onPositionChangedHandler.bind(this);
		// Throw Event after setting Handler:
		this.onPositionUpdated({
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
		return floorVec2D(this.currentPosition);
	}

	public get traveledDistanceInPx(): number {
		return Math.round(this.traveledDistance);
	}

	public get rotationDegreeRounded() {
		return Math.round(this.rotationDegree);
	}
}
