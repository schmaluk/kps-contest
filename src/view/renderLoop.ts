import { config } from '../config';

export interface IRenderable {
	render: () => void;
}

export const initRenderLoop = (...renderObjects: IRenderable[]) =>
	setInterval(() => {
		for (const renderObject of renderObjects) {
			renderObject.render();
		}
	}, config.RENDER_UPDATE_INTERVAL_MS);
