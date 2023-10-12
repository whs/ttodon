import { customElement } from 'lit/decorators.js';
import TNotification from './t-notification.ts';
import { css, html, LitElement } from 'lit';

@customElement('t-notification-area')
export class TNotificationArea extends LitElement {
	static styles = css`
		:host {
			display: block;
			position: fixed;
			z-index: 3;
			top: 30px;
			right: 20px;
		}
	`;

	render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-notification-area': TNotification;
	}
}
