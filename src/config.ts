import { IVector2D } from './utils/vectorUtils';

export const config = {
	SHIP_SPEED_PX_PER_SEC: 20,
	UPDATE_LOOP_INTERVAL_MS: 50,
	SEA_WIDTH: 400,
	SEA_LENGTH: 400,
	INITIAL_SHIP_POSITION: [200, 200] as [number, number],
	STATION: {
		one: { position: [20, 200] as IVector2D, dockAngle: 0 },
		two: { position: [380, 200] as IVector2D, dockAngle: 180 },
		three: { position: [200, 20] as IVector2D, dockAngle: 90 },
		four: { position: [200, 380] as IVector2D, dockAngle: 270 }
	}
};
