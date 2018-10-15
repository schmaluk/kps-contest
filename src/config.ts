import { IVector2D } from './utils/vectorUtils';

export const config = {
	SHIP_SPEED_PX_PER_SEC: 20,
	UPDATE_LOOP_INTERVAL_MS: 1000,
	SEA_WIDTH: 400,
	SEA_LENGTH: 400,
	INITIAL_SHIP_POSITION: [200, 200] as [number, number],
	STATION_POSITIONS: {
		1: [0, 200] as IVector2D,
		2: [400, 200] as IVector2D,
		3: [200, 0] as IVector2D,
		4: [200, 400] as IVector2D
	}
};
