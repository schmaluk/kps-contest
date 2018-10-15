import { IVector2D } from './utils/vectorUtils';

export const config = {
	SHIP_SPEED_PX_PER_SEC: 20,
	UPDATE_LOOP_INTERVAL_MS: 50,
	SEA_WIDTH: 400,
	SEA_LENGTH: 400,
	INITIAL_SHIP_POSITION: [200, 200] as [number, number],
	STATION: {
		one: { position: [30, 200] as IVector2D, dockAngle: 0 },
		two: { position: [370, 200] as IVector2D, dockAngle: 180 },
		three: { position: [200, 30] as IVector2D, dockAngle: 90 },
		four: { position: [200, 370] as IVector2D, dockAngle: 270 }
	}
};
