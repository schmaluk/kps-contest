import {
	addVec2Ds,
	IVector2D,
	multiplyVec2DByScalar,
	vec2DEquals,
	roundVec2D,
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
	measurePxDistance: (x: IVector2D, y: IVector2D) => number;
};

// Signature of IOnShipMoved-EventHandler for registering to a Ship-instance:
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

	// Could be derived from other props but included here for simplicity:
	public isMoving: boolean = false;

	// EventHandler fired when ship has been moved:
	private _onShipMoved: IOnShipMovedHandler | null;

	// timestamp of the last MoveRequest:
	private _lastMoveRequestTimestamp: number | null;

	public constructor(private shipConfig: IShipConfig) {
		// Initialize the current position of the ship:
		this._currentPosition = shipConfig.position;
	}

	// Checks, if we should update the current position of the ship:
	private shouldMove(): boolean {
		// On 1st MoveRequest the timestamp is missing:
		// Skip any movement:
		const isFirstUpdate = !this._lastMoveRequestTimestamp;
		if (isFirstUpdate) {
			return false;
		}

		// When a target station has not been set yet:
		// Skip any movement:
		const shipHasNoTargetStation = !this._targetStation;
		if (shipHasNoTargetStation) {
			return false;
		}

		// Ship has already arrived at target station:
		// Skip any movement:
		const shipHasArrivedAtTargetStation = vec2DEquals(
			this._currentPosition,
			this._targetStation.position
		);
		if (shipHasArrivedAtTargetStation) {
			return false;
		}

		return true;
	}

	// Moves ship to targetStation's position
	// & sets to targetStation's rotation angle:
	private dockToTargetStation(): void {
		this._traveledDistance += this.shipConfig.measurePxDistance(
			this._currentPosition,
			this._targetStation.position
		);
		this._currentPosition = this._targetStation.position;
		// Rotate Ship for docking:
		this._rotationAngle = this._targetStation.dockAngle;
		this.isMoving = false;
		this._lastStation = this._targetStation;
	}

	// Internal helper: Moves ship towards targetStation:
	private moveTowardsTargetStation(distanceToMove: number): void {
		const vectorToTargetStation = subtractVec2Ds(
			this._targetStation.position,
			this._currentPosition
		);
		const vectorToNewPosition = multiplyVec2DByScalar(
			distanceToMove /
				this.shipConfig.measurePxDistance(vectorToTargetStation, [0, 0]),
			vectorToTargetStation
		);

		const newPosition = addVec2Ds(this._currentPosition, vectorToNewPosition);

		this._traveledDistance += this.shipConfig.measurePxDistance(
			this._currentPosition,
			newPosition
		);

		// Update _currentPosition:
		this._currentPosition = newPosition;
		this.isMoving = true;

		// Calculate suitable rotation angle:
		const connectionVector = multiplyVec2DByScalar(
			1 / vec2DLength(vectorToTargetStation),
			vectorToTargetStation
		);
		const cosAlpha = vec2DScalarProduct([-1, 0], connectionVector);
		const alpha = (Math.acos(cosAlpha) / Math.PI) * 180;
		const rotationAngleAbsolute = alpha >= 0 ? alpha : 180 - alpha;
		// Calculate sign for rotation: + or - aka 1 or -1
		const rotationSign =
			vec2DScalarProduct([0, 1], vectorToNewPosition) >= 0 ? -1 : 1;
		this._rotationAngle = rotationSign * rotationAngleAbsolute;
	}

	// Internal helper: Updates the _currentPosition depending on elapsedTime and speed:
	private moveShip(elapsedTimeInMs: number) {
		// moveDistance is the distance the ship can move within this step:
		const distanceToMove = elapsedTimeInMs * this.shipConfig.shipSpeedPxPerMs;

		const distanceToTarget = distanceBetweenVec2Ds(
			this._targetStation.position,
			this._currentPosition
		);

		// Check, if the ship can reach the _targetStation during this update:
		if (distanceToTarget < distanceToMove) {
			// Ship can reach targetStation within this MoveRequest:
			this.dockToTargetStation();
		} else {
			// Target is not yet reachable during this MoveRequest:
			this.moveTowardsTargetStation(distanceToMove);
		}

		// Throw PositionUpdated-Event:
		this._onShipMoved &&
			this._onShipMoved({
				ship: this
			});
	}

	// Periodically called externally to calculate new ship's position:
	public requestMove(): void {
		const now = Date.now();
		const elapsedTimeInMs = now - this._lastMoveRequestTimestamp;

		// Check, if ship should get moved at all:
		const shouldMove = this.shouldMove();

		if (shouldMove) {
			this.moveShip(elapsedTimeInMs);
		}

		// Update timestamp:
		this._lastMoveRequestTimestamp = now;
	}

	public registerOnShipMovedHandler(onShipMovedHandler: IOnShipMovedHandler) {
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

	public getCurrentPositionInPx(): IVector2D {
		return roundVec2D(this._currentPosition);
	}

	public getTraveledDistanceInPx(): number {
		return Math.round(this._traveledDistance);
	}

	public getRotationAngleRounded() {
		return Math.round(this._rotationAngle);
	}
}
