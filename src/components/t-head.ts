import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Header buttons and other UI
 * Ported from thaiWitter #head
 */
@customElement('t-head')
export default class HeaderBar extends LitElement {
	static styles = css`
		:host {
			display: flex;
			justify-content: space-between;
			width: 100%;
			background: #090807;
			color: #e9e8e7;
			border-bottom: 1px solid #454443;
			line-height: 1.03em;
			padding: 0 5px;
			box-sizing: border-box;
		}
		::slotted(:not(t-button)) {
			display: inline-block;
			padding: 5px 7px;
		}
	`;

	render() {
		return html`
			<div class="column">
				<slot></slot>
			</div>
			<div class="column">
				<slot name="right"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-head': HeaderBar;
	}
}
