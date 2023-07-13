import { ReactiveController } from 'lit';
import { Timeline } from '../../model/timeline';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MastodonStatus } from '../../api/mastodon/types';
import type App from './index';
import { mockStatusStream } from '../../stories/data.ts';

export default class TimelineController implements ReactiveController {
	host: App;

	timeline = new Timeline();
	currentTimeline: BehaviorSubject<MastodonStatus>[] = [];

	private _timelineSubscription?: Subscription;

	constructor(host: App) {
		(this.host = host).addController(this);

		// TODO: Demo
		this.timeline.sources.next(mockStatusStream(500));
	}

	hostConnected() {
		this._timelineSubscription = this.timeline.timeline.subscribe(
			this.timelineObserver
		);
	}

	hostDisconnected() {
		this._timelineSubscription?.unsubscribe();
	}

	protected timelineObserver = (
		timeline: BehaviorSubject<MastodonStatus>[]
	) => {
		if (timeline !== this.currentTimeline) {
			this.currentTimeline = timeline;
			this.host.requestUpdate();
		}
	};
}
