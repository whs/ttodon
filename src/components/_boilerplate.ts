import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('t-')
export default class Name extends LitElement {
	static styles = css``;

	render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-': Name;
	}
}
