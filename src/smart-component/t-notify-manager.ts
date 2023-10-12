import { html, LitElement, ReactiveController } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Notification, notificationStreamContext } from '../model/notify';
import { ContextConsumer } from '@lit/context';
import {
	animationFrameScheduler,
	BehaviorSubject,
	scan,
	Subject,
	subscribeOn,
	Subscription,
} from 'rxjs';
import { ReactiveElement } from '@lit/reactive-element';
import { repeat } from 'lit/directives/repeat.js';
import '../components/t-notification';
import '../components/t-notification-area';

/**
 * Store and render notifications
 */
@customElement('t-notify-manager')
export default class NotifyManager extends LitElement {
	@property()
	stream!: Subject<Notification>;

	controller = new NotifyController(this, this.stream);

	render() {
		// TODO: Remove notification from the array when not in use
		// TODO: Very early notification are missed
		return html`<t-notification-area
			>${repeat(
				this.controller.notifications.value,
				(item) => html`<t-notification>${item.text}</t-notification>`
			)}</t-notification-area
		>`;
	}
}

export class NotifyController implements ReactiveController {
	protected host: ReactiveElement;
	protected provider?: ContextConsumer<
		typeof notificationStreamContext,
		ReactiveElement
	>;
	notifications = new BehaviorSubject<Notification[]>([]);
	private subscription?: Subscription;
	private hostSubscription?: Subscription;

	constructor(host: ReactiveElement, stream?: Subject<Notification>) {
		(this.host = host).addController(this);

		// The notificationStream can be passed to this controller in two ways:
		// 1. Using the stream in constructor param
		// 2. Received from context (note the context propagation delay)
		if (stream) {
			this.onReceiveStream(stream);
		} else {
			this.provider = new ContextConsumer(host, {
				context: notificationStreamContext,
				callback: this.onReceiveStream,
			});
		}
	}

	onReceiveStream = (stream: Subject<Notification>) => {
		let processedStream = stream.pipe(
			scan((accumulator, value) => {
				accumulator.push(value);
				return accumulator;
			}, [] as Notification[]),
			subscribeOn(animationFrameScheduler)
		);
		this.subscription?.unsubscribe();
		this.subscription = processedStream.subscribe(this.notifications);
	};

	hostConnected() {
		this.hostSubscription = this.notifications.subscribe(() => {
			this.host.requestUpdate();
		});
	}

	hostDisconnected() {
		this.hostSubscription?.unsubscribe();
		this.subscription?.unsubscribe();
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-notify-manager': NotifyManager;
	}
}
