import { IVector2D } from './utils/vectorUtils';

export const config = {
	SHIP_SPEED_PX_PER_SEC: 20,
	UPDATE_LOOP_INTERVAL_MS: 1000,
	SEA_WIDTH: 400,
	SEA_LENGTH: 400,
	INITIAL_SHIP_POSITION: [200, 200] as [number, number],
	STATION: {
		1: { position: [20, 200] as IVector2D, dockDegree: 0 },
		2: { position: [380, 200] as IVector2D, dockDegree: 180 },
		3: { position: [220, 20] as IVector2D, dockDegree: 90 },
		4: { position: [220, 380] as IVector2D, dockDegree: 270 }
	}
};
