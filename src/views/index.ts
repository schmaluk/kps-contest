import { Statistics } from './statistics';
import { LakeMap } from './lakeMap';
import { buttons } from './buttons';

export const View = {
	buttons,
	statistics: new Statistics(),
	lakeMap: new LakeMap()
};
