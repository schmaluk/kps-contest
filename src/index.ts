import { Ship } from './models/ship';
import { config } from './config';
import { StatisticsView } from './views/statisticsView';
import { LakeView } from './views/lakeView';
import { registerOnStationChangeHandlers } from './views/buttons';
import { Station } from './models/station';

console.log('Started');

// Initialize View components:
const statisticsView = new StatisticsView();
const lakeView = new LakeView();

const stations = {
	1: new Station(config.STATION.one),
	2: new Station(config.STATION.two),
	3: new Station(config.STATION.three),
	4: new Station(config.STATION.four)
};

// Initialize Ship Model instance:
const ship = new Ship({
	shipSpeedPxPerMs: config.SHIP_SPEED_PX_PER_SEC / 1000,
	position: [200, 200]
});
// Register EventHandler on Ship model instance:
ship.onPxPositionChanged = event => {
	console.log(JSON.stringify(event));
	// Update StatisticsView:
	statisticsView.setTraveledDistance(event.ship.traveledPxDistance);
	statisticsView.setIsMoving(event.ship.isMoving);
	statisticsView.setLastStation(
		(event.ship.lastStation && event.ship.lastStation.stationNumber) || null
	);
	// Update LakeView:
	lakeView.setBoatOnLake({
		position: event.ship.currentPxPosition,
		rotationDegree: event.ship.rotationDegreeFloored
	});
};

registerOnStationChangeHandlers(stationNumber => {
	console.log('station.ts changed : ' + stationNumber);
	const targetStation = stations[stationNumber];
	ship.targetStation = targetStation;
});

setInterval(() => {
	ship.loopUpdate();
}, config.UPDATE_LOOP_INTERVAL_MS);
