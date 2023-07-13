import {
	BehaviorSubject,
	connectable,
	mergeAll,
	Observable,
	scan,
	Subject,
} from 'rxjs';
import { freeze, produce } from 'immer';
import {
	isEventType,
	MastodonStatus,
	ParsedStreamEvent,
} from '../api/mastodon/types';
import { findLastIndex, remove } from 'lodash-es';

export const BATCH_UPDATE_EVENT: unique symbol = Symbol('batch_update');

export interface BatchUpdateEvent {
	event: typeof BATCH_UPDATE_EVENT;
	data: MastodonStatus[];
}

export type AllowedEvent = BatchUpdateEvent | ParsedStreamEvent;

export class Timeline {
	/**
	 * A stream of timeline data sources.
	 *
	 * - Publish data into this (sources.next(observable)) to add new sources.
	 * - Source cannot be removed, but is monitored until end of stream.
	 *   Wrap the observable with observable.takeUntil(stopSignal) to allow external control of end-of-stream
	 */
	sources = new Subject<Observable<AllowedEvent>>();

	/**
	 * A stream of timeline events from all sources
	 */
	timelineEvents = this.sources.pipe(mergeAll());

	/**
	 * An Rx Subject of an array of current statuses. Status can be added and removed from this list. Each status
	 * is also a BehaviorSubject. If a status is removed, its observable will be completed.
	 *
	 * The emitted array is immutable (but not its members, although consumers should not mutate any part of the output).
	 * The === operator can be used to verify that two different emissions is exactly the same.
	 */
	timeline = new BehaviorSubject([] as BehaviorSubject<MastodonStatus>[]);

	private timelineConnectable = connectable(
		this.timelineEvents.pipe(scan(this._scan, [])),
		{
			connector: () => this.timeline,
			resetOnDisconnect: false,
		}
	).connect();

	public close() {
		this.sources.complete();
		// XXX: Do timelineEvents needs to be closed?
		this.timelineConnectable.unsubscribe();
	}

	/**
	 * Return the current timeline as array without observability
	 */
	public getCurrentTimeline() {
		return this.timeline.value.map((item) => item.value);
	}

	/**
	 * _scan
	 */
	protected _scan(
		accumulator: BehaviorSubject<MastodonStatus>[],
		e: AllowedEvent,
		_index: number
	): BehaviorSubject<MastodonStatus>[] {
		return produce(accumulator, (draft) => {
			if (isEventType(e, 'update')) {
				e = {
					event: BATCH_UPDATE_EVENT,
					data: [e.data],
				};
			}

			if (e.event === BATCH_UPDATE_EVENT) {
				for (let item of e.data) {
					freeze(item);
					draft.push(new BehaviorSubject(item));
				}
			} else if (isEventType(e, 'status.update')) {
				let data = e.data;
				let index = findLastIndex(
					accumulator,
					(needle) => needle.value.id === data.id
				);
				if (index === -1) {
					return;
				}

				// Update the status at that index
				freeze(data);
				draft[index].next(data);
			} else if (isEventType(e, 'delete')) {
				let statusId = e.data;
				let removed = remove(draft, (needle) => needle.value.id === statusId);

				for (let item of removed) {
					item.complete();
				}
			}
		});
	}
}
