import { config } from '../config';

export interface IUpdatableModel {
	updateModel(elapsedTimeInMs: number): void;
}

export const initUpdateModelLoop = (...models: IUpdatableModel[]) =>
	setInterval(() => {
		for (const model of models) {
			model.updateModel(config.MODEL_UPDATE_INTERVAL_MS);
		}
	}, config.MODEL_UPDATE_INTERVAL_MS);
