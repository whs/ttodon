import { beforeEach, afterEach, describe, test, expect } from 'vitest';
import { AllowedEvent, BATCH_UPDATE_EVENT, Timeline } from './timeline';
import { firstValueFrom, lastValueFrom, skip, Subject } from 'rxjs';
import { MastodonStatus } from '../api/mastodon/types';

let underTest: Timeline;
let source: Subject<AllowedEvent>;

beforeEach(() => {
	underTest = new Timeline();
	source = new Subject<AllowedEvent>();
	underTest.sources.next(source);
});

afterEach(() => {
	source.complete();
	underTest.close();
});

function fakeStatus(id: string | number): MastodonStatus {
	return { id: id.toString(), content: id.toString() } as any;
}

describe('timeline', function () {
	test('update', () => {
		expect(underTest.timeline.value).toEqual([]);
		source.next({
			event: 'update',
			data: fakeStatus(1),
		});
		let currentValue = underTest.timeline.value;
		expect(underTest.getCurrentTimeline()).toEqual([fakeStatus(1)]);

		source.next({
			event: 'update',
			data: fakeStatus(2),
		});
		expect(underTest.getCurrentTimeline()).toEqual([
			fakeStatus(1),
			fakeStatus(2),
		]);
		expect(underTest.timeline.value).not.toStrictEqual(currentValue);
	});

	test('batchUpdate', () => {
		expect(underTest.timeline.value).toEqual([]);
		source.next({
			event: BATCH_UPDATE_EVENT,
			data: [fakeStatus(1), fakeStatus(2)],
		});
		let currentValue = underTest.timeline.value;
		expect(underTest.getCurrentTimeline()).toEqual([
			fakeStatus(1),
			fakeStatus(2),
		]);

		source.next({
			event: BATCH_UPDATE_EVENT,
			data: [fakeStatus(3), fakeStatus(4)],
		});
		expect(underTest.getCurrentTimeline()).toEqual([
			fakeStatus(1),
			fakeStatus(2),
			fakeStatus(3),
			fakeStatus(4),
		]);
		expect(underTest.timeline.value).not.toStrictEqual(currentValue);
	});

	test('status.update', async () => {
		source.next({
			event: 'update',
			data: fakeStatus(1),
		});
		let itemObservable = underTest.timeline.value[0];
		let currentValue = itemObservable.value;
		let nextValue = firstValueFrom(itemObservable.pipe(skip(1)));

		source.next({
			event: 'status.update',
			data: {
				id: '1',
				updated: true,
			} as any,
		});

		expect(itemObservable.value).toEqual({
			id: '1',
			updated: true,
		});
		expect(itemObservable.value).not.toStrictEqual(currentValue);
		return expect(nextValue).resolves.toEqual({ id: '1', updated: true });
	});

	describe('delete', () => {
		test('delete status from timeline', () => {
			source.next({
				event: BATCH_UPDATE_EVENT,
				data: [fakeStatus(1), fakeStatus(2)],
			});
			let currentValue = underTest.timeline.value;

			source.next({
				event: 'delete',
				data: '1',
			});
			expect(underTest.getCurrentTimeline()).toEqual([fakeStatus(2)]);
			expect(underTest.timeline.value).not.toStrictEqual(currentValue);
			currentValue = underTest.timeline.value;

			// delete of non-existing value
			source.next({
				event: 'delete',
				data: '3',
			});
			expect(underTest.getCurrentTimeline()).toEqual([fakeStatus(2)]);
			expect(underTest.timeline.value).toStrictEqual(currentValue);

			source.next({
				event: 'delete',
				data: '2',
			});
			expect(underTest.getCurrentTimeline()).toEqual([]);
		});

		test('complete the status observable', () => {
			source.next({
				event: 'update',
				data: fakeStatus(1),
			});
			let itemObservable = underTest.timeline.value[0];
			source.next({
				event: 'delete',
				data: '1',
			});
			return expect(lastValueFrom(itemObservable)).rejects.toEqual(
				expect.anything()
			);
		});
	});
});
