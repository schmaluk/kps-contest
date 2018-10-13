export interface IUpdatableModel {
	updateModel(elapsedTimeInMs: number): void;
}

export const initUpdateModelLoop = (
	loopConfig: { updateIntervalInMs: number },
	...models: IUpdatableModel[]
) =>
	setInterval(() => {
		for (const model of models) {
			model.updateModel(loopConfig.updateIntervalInMs);
		}
	}, loopConfig.updateIntervalInMs);
