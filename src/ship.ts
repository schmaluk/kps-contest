import { KpsShip } from './models/kpsShip';
import { config } from './config';

console.log('Started');

const ship = new KpsShip({
	shipSpeedPxPerMs: 10,
	position: [200, 200]
});
ship.onPxPositionChanged = event => {
	console.log(JSON.stringify(event));
};
ship.target = [0, 0];

setInterval(() => {
	ship.updateModel(config.UPDATE_LOOP_INTERVAL_MS);
}, config.UPDATE_LOOP_INTERVAL_MS);
