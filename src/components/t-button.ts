import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Button
 * Ported from .menu-item
 */
@customElement('t-button')
export default class Button extends LitElement {
	static styles = css`
		:host {
			display: inline-block;
			padding: 5px 7px;
			cursor: pointer;
		}

		:host(:hover) {
			background: #454443;
		}

		.active {
			background: #222324;
		}
	`;

	render() {
		return html` <slot></slot> `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-button': Button;
	}
}
