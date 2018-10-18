import { Ship } from './models/ship';
import { config } from './config';
import { View } from './views';
import { Station } from './models/station';

// Create Ship Model instance:
const ship = new Ship({
	shipSpeedPxPerMs: config.SHIP_SPEED_PX_PER_SEC / 1000,
	position: [200, 200]
});

// Register EventHandler to Ship model:
ship.setOnShipMovedHandler(event => {
	console.log(JSON.stringify(event));
	// Update View: Statistics
	View.statistics.setTraveledDistance(event.ship.traveledDistanceInPx);
	View.statistics.setIsMoving(event.ship.isMoving);
	View.statistics.setLastStation(
		(event.ship.getLastStation() &&
			event.ship.getLastStation().stationNumber) ||
			null
	);
	// Update View: LakeMap
	View.lakeMap.placeBoatOnLake({
		position: event.ship.currentPositionInPx,
		rotationAngle: event.ship.rotationAngleRounded
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
