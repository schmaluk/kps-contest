import { Ship } from './models/ship';
import { config } from './config';
import { StatisticsView } from './views/statisticsView';
import { LakeView } from './views/lakeView';
import { registerOnStationChangeHandlers } from './views/buttons';

console.log('Started');

// Initialize View components:
const statisticsView = new StatisticsView();
const lakeView = new LakeView();

export type IStationNumber = 1 | 2 | 3 | 4;
let lastStationNumber: IStationNumber | null = null;

// Initialize Ship Model instance:
const ship = new Ship({
	shipSpeedPxPerMs: config.SHIP_SPEED_PX_PER_SEC / 1000,
	position: [200, 200]
});
// Register EventHandler on Ship model instance:
ship.onPxPositionChanged = event => {
	console.log(JSON.stringify(event));
	// Update StatisticsView:
	statisticsView.setTraveledDistance(event.kpsShip.traveledPxDistance);
	statisticsView.setIsMoving(event.kpsShip.isPxMoving);
	statisticsView.setLastStation(lastStationNumber);
	// Update LakeView:
	lakeView.setBoatOnLake({
		position: event.kpsShip.currentPxPosition,
		rotationDegree: event.kpsShip.rotationDegreeFloored
	});
};
registerOnStationChangeHandlers(stationNumber => {
	console.log('station changed : ' + stationNumber);
	ship.target = config.STATION_POSITIONS[stationNumber];
});

setInterval(() => {
	ship.loopUpdate();
}, config.UPDATE_LOOP_INTERVAL_MS);
