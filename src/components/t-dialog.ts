import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Ported from TWDialog class
 */
@customElement('t-dialog')
export default class Dialog extends LitElement {
	@property({ type: String })
	title!: string;

	static styles = css`
		:host {
			position: fixed;
			z-index: 3;
			display: flex;
			justify-content: center;
			width: 100%;
			pointer-events: none;
			top: 60px;
		}

		.dialog {
			border: 2px solid #737271;
			background: #000;
			text-align: center;
			pointer-events: auto;
			width: 360px;
		}

		.link {
			cursor: pointer;
		}

		header {
			font-weight: bold;
			font-size: 14pt;
			color: #797877;
			padding: 0.7em 0 0.6em;
		}

		footer {
			color: #696867;
			padding: 0.8em 1.5em 1.2em;
			font-size: 8pt;
		}
	`;

	render() {
		return html`
			<div class="dialog">
				<header>
					${this.title}
					<span class="link" @click="${this.onClose}"> (x)</span>
				</header>
				<div class="content">
					<slot></slot>
				</div>
				<footer>
					<slot name="footer"></slot>
				</footer>
			</div>
		`;
	}

	private onClose(e: MouseEvent) {
		e.preventDefault();
		const event = new CustomEvent('close', { bubbles: true, composed: true });

		this.dispatchEvent(event);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-dialog': Dialog;
	}
}
