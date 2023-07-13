import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import '../../components/t-head';
import '../../components/t-hotkey';
import '../../components/t-button';
import '../../components/t-timeline';
import '../../components/t-status';
import '../../components/t-message-bar';
import type HeaderBar from '../../components/t-head';
import type MessageBar from '../../components/t-message-bar';
import type Timeline from '../../components/t-timeline';
import { repeat } from 'lit/directives/repeat.js';
import TimelineController from './timelinecontroller';

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

	head = createRef<HeaderBar>();
	bottomBar = createRef<HTMLDivElement>();
	messageBar = createRef<MessageBar>();
	timelineComponent = createRef<Timeline>();

	render() {
		return html`
			<div class="head">
				<t-head ${ref(this.head)}>
					<t-button>
						<t-hotkey hotkey="R">Refresh</t-hotkey>
					</t-button>
					<t-button>
						<t-hotkey hotkey="T" hotkeyindex="6">Retweet</t-hotkey>
					</t-button>
					<t-button>
						<t-hotkey hotkey="Y">Reply</t-hotkey>
					</t-button>
					<t-button>
						<t-hotkey hotkey="E">Fave</t-hotkey>
					</t-button>
					<t-button> ▼ </t-button>

					<t-menu-item slot="right" title="Position"
						>${this.timelineComponent.value?.selected !== undefined
							? this.timelineComponent.value.selected + 1
							: 0}
						/ ${this.timelineController.currentTimeline.length}</t-menu-item
					>
					<t-menu-item slot="right" title="Status Text Limit"
						>${this.getStatusTextLeft()}</t-menu-item
					>
				</t-head>
			</div>
			<t-timeline
				toppad="${this.head.value?.offsetHeight || 25}"
				bottompad="${this.bottomBar.value?.offsetHeight || 45}"
				@select=${() => this.requestUpdate()}
				${ref(this.timelineComponent)}
			>
				<div class="welcome" slot="header">
					<strong>${__APP_NAME__}</strong> [Version ${__APP_VERSION__}]
				</div>
				${repeat(
					this.timelineController.currentTimeline,
					(item) => item.value.id,
					(item) => html`<t-status .object=${item.value}></t-status>`
				)}
			</t-timeline>
			<div class="message-bar" ${ref(this.bottomBar)}}>
				<t-message-bar
					@input=${() => this.requestUpdate()}
					autofocus
					${ref(this.messageBar)}}
				></t-message-bar>
			</div>
		`;
	}

	protected firstUpdated() {
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

	private onResize = () => {
		this.requestUpdate();
	};

	getStatusTextLeft() {
		let enteredText = this.messageBar.value?.value || '';

		return 140 - enteredText.length;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-app': App;
	}
}
