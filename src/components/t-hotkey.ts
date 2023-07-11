import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('t-hotkey')
export class Hotkey extends LitElement {
	/**
	 * Letter to highlight as hotkey
	 */
	@property()
	hotkey: string | undefined = undefined;

	/**
	 * Index in the textContent to highlight hotkey. Default to the first occurence of hotkey letter
	 * May cause undefined behavior if incorrect value is used.
	 */
	@property({ type: Number })
	hotkeyIndex: number | undefined = undefined;

	static styles = css`
		.hotkey {
			color: var(--text-highlight-color);
			text-decoration: underline;
		}

		.hotkey-alt {
			color: #d770fc;
			text-decoration: underline;
		}
	`;

	render() {
		if (!this.hotkey || !this.textContent) {
			return this.passthrough();
		}
		let hotkeyPosition =
			this.hotkeyIndex || this.textContent.search(new RegExp(this.hotkey, 'i'));
		if (hotkeyPosition === -1) {
			return this.passthrough();
		}
		let before = this.textContent.substring(0, hotkeyPosition);
		let hotkey = this.textContent[hotkeyPosition];
		let after = this.textContent.substring(hotkeyPosition + 1);
		return html`${before}<span
                class="hotkey">${hotkey}</span>${after}
        </span>`;
	}

	private passthrough() {
		return html` <slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-hotkey': Hotkey;
	}
}
