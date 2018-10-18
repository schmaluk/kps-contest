import { IVector2D } from './utils/vectorUtils';

export const config = {
	SHIP_SPEED_PX_PER_SEC: 20,
	UPDATE_LOOP_INTERVAL_MS: 25,
	INITIAL_SHIP_POSITION: [200, 200] as [number, number],
	STATION: {
		one: { stationNumber: 1, position: [30, 200] as IVector2D, dockAngle: 0 },
		two: {
			stationNumber: 2,
			position: [370, 200] as IVector2D,
			dockAngle: 180
		},
		three: {
			stationNumber: 3,
			position: [200, 30] as IVector2D,
			dockAngle: 90
		},
		four: {
			stationNumber: 4,
			position: [200, 370] as IVector2D,
			dockAngle: 270
		}
	},
	METRIC: 'Chebyshev' as 'Chebyshev'
	// Alternative metrics for calculating the traveled distance:
	//	METRIC: 'Euclidean' as 'Euclidean',
	//	METRIC: 'Manhattan' as 'Manhattan',
};
