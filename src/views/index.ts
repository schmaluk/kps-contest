import { addStationChangeHandlers } from './buttons';
import { Statistics } from './statistics';
import { Lake } from './lake';

export const View = {
	buttons: {
		addStationChangeHandlers
	},
	statistics: new Statistics(),
	lake: new Lake()
};
