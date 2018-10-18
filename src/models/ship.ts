import {
	addVec2Ds,
	IVector2D,
	multiplyVec2DByScalar,
	vec2DEquals,
	roundVec2D,
	subtractVec2Ds,
	vec2DLength,
	vec2DScalarProduct,
	distanceBetweenVec2Ds,
	pxDistance
} from '../utils/vectorUtils';
import { Station } from './station';

// Initial config for a new Ship instance passed to constructor:
export type IShipConfig = {
	position: IVector2D;
	shipSpeedPxPerMs: number;
};

// Signature of PxPositionChange-Handler for registering to a Ship-instance:
export type IOnShipMovedHandler = (
	event: {
		ship: Ship;
	}
) => void;

// Ship-Model:
export class Ship {
	// ship's state:
	private _currentPosition: IVector2D;
	private _traveledDistance: number = 0;

	private _targetStation: Station | null;
	private _lastStation: Station | null;

	private _rotationAngle: number = 0;

	// Could be derived but included here for simplicity:
	public isMoving: boolean = false;

	// EventHandler fired when ship's position has been updated:
	private _onShipMoved: IOnShipMovedHandler | null;

	// timestamp of last update of ship's position:
	private _lastMoveRequestTimestamp: number | null;

	public constructor(private shipConfig: IShipConfig) {
		// Save ship's configuration: speed etc.
		this._currentPosition = shipConfig.position;
	}

	// Checks, if we should update the current position of the ship:
	private shouldMove(): boolean {
		// Upon 1st update call the ship's position change missing timestamp:
		// Skip position update
		const isFirstUpdate = !this._lastMoveRequestTimestamp;
		if (isFirstUpdate) {
			return false;
		}

		// When a target station has not been set yet:
		// Skip position update
		const shipHasNoTargetStation = !this._targetStation;
		if (shipHasNoTargetStation) {
			return false;
		}

		// Ship has already arrived at target station:
		// Skip position update
		const shipHasArrivedAtTargetStation = vec2DEquals(
			this._currentPosition,
			this._targetStation.position
		);
		if (shipHasArrivedAtTargetStation) {
			return false;
		}

		return true;
	}

	private dockToTargetStation(): void {
		this._traveledDistance += pxDistance(
			this._currentPosition,
			this._targetStation.position
		);
		this._currentPosition = this._targetStation.position;
		// Rotate Ship for docking:
		this._rotationAngle = this._targetStation.dockAngle;
		this.isMoving = false;
		this._lastStation = this._targetStation;
	}

	private moveTowardsTargetStation(distanceToMove: number): void {
		const connection = subtractVec2Ds(
			this._targetStation.position,
			this._currentPosition
		);
		const normalizedDirection = multiplyVec2DByScalar(
			1 / vec2DLength(connection),
			connection
		);

		const newPosition = addVec2Ds(
			this._currentPosition,
			multiplyVec2DByScalar(distanceToMove, normalizedDirection)
		);

		this._traveledDistance += pxDistance(this._currentPosition, newPosition);

		// Update _currentPosition:
		this._currentPosition = newPosition;
		this.isMoving = true;

		// Update rotation degree:
		const cosAlpha = vec2DScalarProduct([-1, 0], normalizedDirection);
		const alpha = (Math.acos(cosAlpha) / Math.PI) * 180;
		const rotationDegree = alpha >= 0 ? alpha : 180 - alpha;
		// Calculate signum for rotation: + or - aka 1 or -1
		const signum =
			vec2DScalarProduct([0, 1], normalizedDirection) >= 0 ? -1 : 1;
		this._rotationAngle = signum * rotationDegree;
	}

	// Updates the _currentPosition depending on elapsedTime and speed:
	private moveShip(elapsedTimeInMs: number) {
		// moveDistance is the distance the ship can move within this step:
		const distanceToMove = elapsedTimeInMs * this.shipConfig.shipSpeedPxPerMs;

		const distanceToTarget = distanceBetweenVec2Ds(
			this._targetStation.position,
			this._currentPosition
		);

		// Check, if the ship can reach the _targetStation during this update:
		if (distanceToTarget < distanceToMove) {
			// Target is within reachable distance during this update:
			this.dockToTargetStation();
		} else {
			// Target is not yet reachable during this update:
			// But move the ship into this direction:
			this.moveTowardsTargetStation(distanceToMove);
		}

		// Throw PositionUpdated-Event:
		this._onShipMoved &&
			this._onShipMoved({
				ship: this
			});
	}

	// Periodically called in order tu update ship's position:
	public requestMove(): void {
		const now = Date.now();
		const elapsedTimeInMs = now - this._lastMoveRequestTimestamp;

		// Check, if any update to _currentPosition is required:
		const shouldMove = this.shouldMove();

		if (shouldMove) {
			this.moveShip(elapsedTimeInMs);
		}

		// Update timestamp:
		this._lastMoveRequestTimestamp = now;
	}

	public setOnShipMovedHandler(onShipMovedHandler: IOnShipMovedHandler) {
		this._onShipMoved = onShipMovedHandler.bind(this);
		// Throw Event after setting Handler:
		this._onShipMoved({
			ship: this
		});
	}

	public setTargetStation(targetStation: Station) {
		this._targetStation = targetStation;
	}

	public getLastStation(): Station {
		return this._lastStation;
	}

	public get currentPositionInPx(): IVector2D {
		return roundVec2D(this._currentPosition);
	}

	public get traveledDistanceInPx(): number {
		return Math.round(this._traveledDistance);
	}

	public get rotationAngleRounded() {
		return Math.round(this._rotationAngle);
	}
}
