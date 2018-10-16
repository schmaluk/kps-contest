export class StatisticsView {
	// Html-View-Elements:
	private traveledDistance: HTMLElement = document.querySelector('#travel');
	private lastStation: HTMLElement = document.querySelector('#last-station');
	private moving: HTMLElement = document.querySelector('#moving');

	public setTraveledDistance(distance: number) {
		this.traveledDistance.innerText = distance.toString(10);
	}

	public setLastStation(stationNumber: number | null) {
		console.log('stationNumber : ' + stationNumber);
		this.lastStation.innerText =
			(stationNumber && stationNumber.toString(10)) || '-';
	}

	public setIsMoving(isMoving: boolean) {
		this.moving.innerText = isMoving ? '1' : '0';
	}
}
