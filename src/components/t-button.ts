import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Button
 * Ported from .menu-item
 */
@customElement('t-button')
export default class Button extends LitElement {
	static formAssociated = true;

	static styles = css`
		:host {
			display: inline-block;
		}

		button {
			padding: 5px 7px;
			cursor: pointer;
			background: transparent;
			border: 0;
			color: inherit;
			margin: 0;
			display: inline-block;
			line-height: 1.03em;
		}

		button:hover {
			background: #454443;
		}

		.active {
			background: #222324;
		}
	`;

	constructor() {
		super();
		this.attachInternals();
	}

	render() {
		return html`<button>
			<slot></slot>
		</button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-button': Button;
	}
}
