import { ReactiveController } from 'lit';
import type App from './index';

export default class MouseScrollController implements ReactiveController {
	protected host: App;

	protected cumulativeDelta = 20;

	constructor(host: App) {
		(this.host = host).addController(this);
	}

	hostConnected() {
		window.addEventListener('wheel', this.onWheel, {
			passive: true,
		});
	}

	hostDisconnected() {
		window.removeEventListener('wheel', this.onWheel);
	}

	/**
	 * Ported from EventHandler.globalWheelWebkit
	 */
	protected onWheel = (e: WheelEvent) => {
		if (this.host.selectedItem === undefined) {
			return;
		}
		this.cumulativeDelta += e.deltaY;
		if (this.cumulativeDelta >= 40) {
			this.cumulativeDelta = this.cumulativeDelta % 40;
			// TODO: Don't use the default scrolling animation! See moveScroll function
			this.host.selectedItem = Math.min(
				this.host.selectedItem + 1,
				this.host.timelineController.currentTimeline.length - 1
			);
		} else if (this.cumulativeDelta < 0) {
			this.cumulativeDelta = this.cumulativeDelta % 40;
			this.host.selectedItem = Math.max(0, this.host.selectedItem - 1);
		}
	};
}
