export const setOnStationChangeHandlersToButtons = (
	stationChangedHandler: (stationNumber: number) => any
) => {
	const buttons = document.querySelectorAll('nav button');
	[0, 1, 2, 3]
		.map(idx => buttons.item(idx) as HTMLButtonElement)
		.map(
			(button, idx) => (button.onclick = () => stationChangedHandler(idx + 1))
		);
};
