import { ReactiveController } from 'lit';
import { Timeline } from '../../model/timeline';
import type App from './index';
import {
	animationFrameScheduler,
	BehaviorSubject,
	subscribeOn,
	Subscription,
} from 'rxjs';
import { MastodonStatus } from '../../api/mastodon/types.ts';

export default class TimelineController implements ReactiveController {
	host: App;

	timeline = new Timeline();
	private _timelineSubscriber: Subscription | undefined;

	constructor(host: App) {
		(this.host = host).addController(this);
	}

	hostConnected() {
		// TODO: Can this be made a directive of repeat()?
		this._timelineSubscriber = this.timeline.timeline
			.pipe(subscribeOn(animationFrameScheduler))
			.subscribe(this.onTimelineUpdate);
	}

	hostDisconnected() {
		this._timelineSubscriber?.unsubscribe();
	}

	get currentTimeline() {
		return this.timeline.timeline.value;
	}

	protected onTimelineUpdate = (
		timeline: BehaviorSubject<MastodonStatus>[]
	) => {
		if (timeline.length > 0 && this.host.selectedItem === undefined) {
			this.host.selectedItem = this.getDefaultSelectedItemIndex();
		}
		this.host.requestUpdate();
	};

	getDefaultSelectedItemIndex() {
		// TODO
		// if (xtra_timeline == 'fave' || xtra_timeline == 'dms' || xtra_timeline == 'mentions') {
		// 	return this._timeline.items.length - 1;
		// }
		return 0;
	}
}
