import { Ship } from './models/ship';
import { config } from './config';
import { StatisticsView } from './views/statisticsView';
import { LakeView } from './views/lakeView';
import { setOnStationChangeHandlersToButtons } from './views/buttons';
import { Station } from './models/station';

// Create View components:
const statisticsView = new StatisticsView();
const lakeView = new LakeView();

// Create Ship Model instance:
const ship = new Ship({
	shipSpeedPxPerMs: config.SHIP_SPEED_PX_PER_SEC / 1000,
	position: [200, 200]
});

// Register EventHandler to Ship model:
ship.setOnPositionChangedHandler = event => {
	console.log(JSON.stringify(event));
	// Update StatisticsView:
	statisticsView.setTraveledDistance(event.ship.traveledDistanceInPx);
	statisticsView.setIsMoving(event.ship.isMoving);
	statisticsView.setLastStation(
		(event.ship.getLastStation() &&
			event.ship.getLastStation().stationNumber) ||
			null
	);
	// Update LakeView:
	lakeView.setBoatOnLake({
		position: event.ship.currentPositionInPx,
		rotationDegree: event.ship.rotationDegreeRounded
	});
};

// Register Handlers to Buttons:
const stations = {
	1: new Station(config.STATION.one),
	2: new Station(config.STATION.two),
	3: new Station(config.STATION.three),
	4: new Station(config.STATION.four)
};
setOnStationChangeHandlersToButtons(stationNumber => {
	const targetStation = stations[stationNumber];
	ship.setTargetStation(targetStation);
});

// Start loop for ship's position update:
setInterval(() => {
	ship.updatePosition();
}, config.UPDATE_LOOP_INTERVAL_MS);
