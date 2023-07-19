import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('t-acct')
export default class Acct extends LitElement {
	static styles = css`
		.domain {
			font-size: 85%;
			color: color-mix(in srgb, black 20%, currentColor);
			letter-spacing: -0.5px;
		}
	`;

	@property({ type: String })
	acct!: string;

	render() {
		let acct = this.acct;
		if (acct.startsWith('@')) {
			acct = acct.substring(1);
		}

		if (!acct.includes('@')) {
			return acct;
		}

		let parts = acct.split('@', 2);
		return html`${parts[0]}<span class="domain">@${parts[1]}</span>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-acct': Acct;
	}
}
