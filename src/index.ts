import { Ship } from './models/ship';
import { config } from './config';
import { View } from './views';
import { Station } from './models/station';
import {
	measureChebyshevDistance,
	measureEuclideanDistance,
	measureManhattanDistance
} from './utils/metrics';

// Select the configured metric for measuring the
// traveled pixel distance of the ship:
const measurePxDistance = {
	Chebyshev: measureChebyshevDistance,
	Euclidean: measureEuclideanDistance,
	Manhattan: measureManhattanDistance
}[config.METRIC];

// Create Ship Model instance:
const ship = new Ship({
	shipSpeedPxPerMs: config.SHIP_SPEED_PX_PER_SEC / 1000,
	position: [200, 200],
	measurePxDistance
});

// Register EventHandler to Ship model:
ship.registerOnShipMovedHandler(event => {
	// Update View: Statistics
	View.statistics.setTraveledDistance(event.ship.getTraveledDistanceInPx());
	View.statistics.setIsMoving(event.ship.isMoving);
	View.statistics.setLastStation(
		(event.ship.getLastStation() &&
			event.ship.getLastStation().stationNumber) ||
			null
	);
	// Update View: LakeMap
	View.lakeMap.placeBoatOnLake({
		position: event.ship.getCurrentPositionInPx(),
		rotationAngle: event.ship.getRotationAngleRounded()
	});
});

// Register Handlers to View: Buttons
const stations = {
	1: new Station(config.STATION.one),
	2: new Station(config.STATION.two),
	3: new Station(config.STATION.three),
	4: new Station(config.STATION.four)
};
View.buttons.addTargetStationChangeHandlers(stationNumber => {
	const targetStation = stations[stationNumber];
	ship.setTargetStation(targetStation);
});

// Start loop for ship's position update:
setInterval(() => {
	ship.requestMove();
}, config.UPDATE_LOOP_INTERVAL_MS);
