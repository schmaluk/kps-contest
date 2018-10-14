import { KpsShip } from '../models/kpsShip';
import { ILoopUpdate } from '../ship';

export class DisplayRenderer implements ILoopUpdate {
	constructor(private kpsShipRef: KpsShip) {}

	loopUpdate(elapsedTimeInMs: number) {}
}
