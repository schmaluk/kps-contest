import { IVector2D } from '../utils/vectorUtils';

export class Station {
	public readonly position: IVector2D;
	public readonly dockAngle: number;
	public readonly stationNumber: number;

	constructor(config: {
		stationNumber: number;
		position: IVector2D;
		dockAngle: number;
	}) {
		this.position = config.position;
		this.dockAngle = config.dockAngle;
		this.stationNumber = config.stationNumber;
	}
}
