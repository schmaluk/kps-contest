export class StatisticsView {
	// Html-View-Elements:
	private traveledDistance = document.querySelector('travel');
	private lastStation = document.querySelector('last-station');
	private moving = document.querySelector('moving');

	set traveledDistanceLabel(distance: number) {
		this.traveledDistance.textContent = distance.toString(10);
	}

	set lastStationLabel(stationNumber: 1 | 2 | 3 | 4) {
		this.lastStation.textContent = stationNumber.toString(10);
	}

	set movingLabel(isMoving: boolean) {
		this.moving.textContent = isMoving ? '0' : '1';
	}
}
