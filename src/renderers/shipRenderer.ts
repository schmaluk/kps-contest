import { KpsShip } from '../models/kpsShip';
import { ILoopUpdate } from '../ship';

export class ShipRenderer implements ILoopUpdate {
	constructor(private kpsShipRef: KpsShip) {}

	loopUpdate(elapsedTimeInMs: number) {}
}
