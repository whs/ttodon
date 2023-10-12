import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { ref, createRef } from 'lit/directives/ref.js';
import '../../components/t-head';
import '../../components/t-hotkey';
import '../../components/t-button';
import '../../components/t-timeline';
import '../../components/t-status';
import '../../components/t-message-bar';
import '../../components/t-dialog';
import '../t-login-dialog';
import '../t-notify-manager';
import type HeaderBar from '../../components/t-head';
import type MessageBar from '../../components/t-message-bar';
import type Timeline from '../../components/t-timeline';
import { repeat } from 'lit/directives/repeat.js';
import TimelineController from './timelinecontroller';
import rx from '../../lib/rxdirective';
import * as clientModel from '../../model/client';
import { catchError, EMPTY, Subject, tap } from 'rxjs';
import MouseScrollController from './mousescrollcontroller';
import { Notification, notificationStreamContext } from '../../model/notify';
import { provide } from '@lit/context';

/**
 * Main UI
 */
@customElement('t-app')
export default class App extends LitElement {
	static styles = css`
		:host {
			display: block;
			width: 100%;
			height: 100%;
		}

		.head {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 1;
		}

		.message-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}

		.welcome {
			text-align: center;
			padding-bottom: 10px;
			border-bottom: 2px solid #444;
		}
	`;

	timelineController = new TimelineController(this);
	mouseScrollController = new MouseScrollController(this);

	@provide({ context: notificationStreamContext })
	@property({ attribute: false })
	notifyStream = new Subject<Notification>();

	@state()
	selectedItem: number | undefined = undefined;

	head = createRef<HeaderBar>();
	bottomBar = createRef<HTMLDivElement>();
	messageBar = createRef<MessageBar>();
	timelineComponent = createRef<Timeline>();

	constructor() {
		super();
		this.loadClientState();

		let state = this.getLoginState();

		if (state === LoginState.REDEEM_CODE) {
			this.redeemCode();
		}
		if (state === LoginState.LOGGED_IN) {
			this.refresh();
		}
	}

	render() {
		let loginState = this.getLoginState();
		return html`
			<div class="head">
				<t-head ${ref(this.head)}>
					<t-button @click=${this.refresh}>
						<t-hotkey hotkey="R">Refresh</t-hotkey>
					</t-button>
					<t-button>
						<t-hotkey hotkey="T">Boost</t-hotkey>
					</t-button>
					<t-button>
						<t-hotkey hotkey="Y">Reply</t-hotkey>
					</t-button>
					<t-button>
						<t-hotkey hotkey="E">Fave</t-hotkey>
					</t-button>
					<t-button> ▼ </t-button>

					<t-menu-item slot="right" title="Position"
						>${this.selectedItem !== undefined ? this.selectedItem + 1 : 0} /
						${this.getTimelineCount()}</t-menu-item
					>
					<t-menu-item slot="right" title="Status Text Limit"
						>${this.getStatusTextLeft()}</t-menu-item
					>
				</t-head>
			</div>
			${loginState === LoginState.NO_USER &&
			html`<t-login-dialog></t-login-dialog>`}
			${loginState === LoginState.REDEEM_CODE &&
			html`<t-dialog title="Logging in..."></t-dialog>`}
			<t-notify-manager stream=${this.notifyStream}></t-notify-manager>
			<t-timeline
				toppad="${this.head.value?.offsetHeight || 25}"
				bottompad="${this.bottomBar.value?.offsetHeight || 45}"
				selected=${this.selectedItem}
				@select=${(e: CustomEvent) => (this.selectedItem = e.detail)}
				@replyclick=${this.onReplyClick}
				${ref(this.timelineComponent)}
			>
				<div class="welcome" slot="header">
					<strong>${__APP_NAME__}</strong> [Version ${__APP_VERSION__}]
				</div>
				${guard([this.timelineController.currentTimeline], () =>
					repeat(
						this.timelineController.currentTimeline,
						(item) => item.value.id,
						(item) => html`<t-status .object=${rx(item)}></t-status>`
					)
				)}
			</t-timeline>
			<div class="message-bar" ${ref(this.bottomBar)}}>
				<t-message-bar
					@input=${() => this.requestUpdate()}
					.autofocus=${loginState === LoginState.LOGGED_IN}
					${ref(this.messageBar)}}
				></t-message-bar>
			</div>
		`;
	}

	protected async firstUpdated() {
		await this.updateComplete;
		this.requestUpdate();
	}

	connectedCallback() {
		super.connectedCallback();

		window.addEventListener('resize', this.onResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this.onResize);
	}

	protected getTimelineCount() {
		return this.timelineController.currentTimeline.length;
	}

	private onResize = () => {
		this.requestUpdate();
	};

	private onReplyClick = (e: CustomEvent) => {
		e.stopPropagation();

		let statusId = e.detail as string;
		let statusIndex = this.timelineController.currentTimeline.findIndex(
			(needle) => needle.value.id === statusId
		);
		if (statusIndex === -1) {
			console.error(`Cannot find status ${statusId}`);
			return;
		}

		this.selectedItem = statusIndex;
	};

	getStatusTextLeft() {
		let enteredText = this.messageBar.value?.value || '';

		return 140 - enteredText.length;
	}

	protected getLoginState(): LoginState {
		// quickly match first, so we don't need to parse full URL
		if (window.location.search.includes('code=')) {
			let url = new URL(window.location.toString());
			if (url.searchParams.has('code')) {
				return LoginState.REDEEM_CODE;
			}
		}
		if (clientModel.instance.value?.hasUserToken.value === true) {
			return LoginState.LOGGED_IN;
		}

		return LoginState.NO_USER;
	}

	protected async redeemCode() {
		let url = new URL(window.location.toString());
		// TODO: We should have a state param...
		try {
			var server = new URL(url.searchParams.get('server')!);
		} catch (e) {
			console.error('fail to parse server url', e);
			return;
		}
		if (!clientModel.hasServerInfo(server)) {
			return;
		}
		await clientModel.setServer(server);

		let code = url.searchParams.get('code')!;
		try {
			await clientModel.exchangeCode(code);
			clientModel.storeLastServerUsed();
			window.location.search = '';
		} catch (e: any) {
			alert(`Fail to exchange code: ${e}`);
			console.error('code redeem fail', e);
			return;
		}
	}

	protected async loadClientState() {
		let lastServer = clientModel.getLastServerUsed();
		if (!lastServer) {
			return;
		}

		await clientModel.setServer(lastServer);
	}

	refresh = () => {
		this.notifyStream.next({
			text: 'Refreshing Timeline...',
		});
		let currentTimeline = this.timelineController.currentTimeline;
		let lastId = undefined;

		if (currentTimeline.length > 0) {
			lastId = currentTimeline[currentTimeline.length - 1].value.id;
		}

		this.timelineController.timeline.sources.next(
			clientModel.instance.value!.loadHomeTimeline({ min_id: lastId }).pipe(
				tap(() => {
					this.notifyStream.next({
						text: 'Timeline Loaded.',
					});
				}),
				catchError((err) => {
					console.error('fail to load timeline', err);
					this.notifyStream.next({
						text: 'Oops! Network Error.',
					});
					return EMPTY;
				})
			)
		);
	};
}

enum LoginState {
	NO_USER,
	REDEEM_CODE,
	LOGGED_IN,
}

declare global {
	interface HTMLElementTagNameMap {
		't-app': App;
	}
}
