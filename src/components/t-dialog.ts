import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Ported from TWDialog class
 */
@customElement('t-dialog')
export default class Dialog extends LitElement {
	@property({ type: String })
	title!: string;

	@property({ type: Boolean })
	closeable: boolean = false;

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
			font-size: 8pt;
			padding: 0.8em 1.5em 1.2em;
		}
	`;

	render() {
		return html`
			<div class="dialog">
				<header>
					${this.title}
					${this.closeable
						? html`<span class="link" @click="${this.onClose}"> (x)</span>`
						: undefined}
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

		if (!this.closeable) {
			return;
		}

		const event = new CustomEvent('close', { bubbles: true, composed: true });
		this.dispatchEvent(event);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-dialog': Dialog;
	}
}
