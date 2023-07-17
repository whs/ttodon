import { ReactiveController } from 'lit';
import { Timeline } from '../../model/timeline';
import type App from './index';
import { Subscription } from 'rxjs';

export default class TimelineController implements ReactiveController {
	host: App;

	timeline = new Timeline();
	private _timelineSubscriber: Subscription | undefined;

	constructor(host: App) {
		(this.host = host).addController(this);
	}

	hostConnected() {
		this._timelineSubscriber = this.timeline.timeline.subscribe(() =>
			this.host.requestUpdate()
		);
	}

	hostDisconnected() {
		this._timelineSubscriber?.unsubscribe();
	}

	get currentTimeline() {
		return this.timeline.timeline.value;
	}
}
