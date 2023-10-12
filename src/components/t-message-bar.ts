import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

/**
 * Message bar
 * Ported from thaiWitter #tweet-bar
 */
@customElement('t-message-bar')
export default class MessageBar extends LitElement {
	@property({ type: Boolean })
	autofocus: boolean = false;

	@property({ type: String })
	value: string = '';

	static styles = css`
		:host {
			display: block;
			width: 100%;
			background: #090807;
			border-top: 1px solid #454443;
			padding: 0 0 0 10px;
			box-sizing: border-box;
		}

		textarea {
			font-family: var(--font-family);
			padding: 0;
			margin: 0;
			border: 0;
			background: transparent;
			color: #e9e8e7;
			width: 100%;
			height: 3em;
			font-size: 11pt;
			resize: none;
			outline: none;
		}
	`;

	protected inputRef = createRef<HTMLTextAreaElement>();

	focus() {
		this.inputRef.value!.focus();
	}

	reset() {
		this.value = '';
	}

	render() {
		return html`<textarea
			cols="100"
			rows="2"
			autocomplete="off"
			@input=${this.onInput}
			${ref(this.inputRef)}
		>
${this.value}</textarea
		>`;
	}

	protected async firstUpdated() {
		if (this.autofocus) {
			await this.updateComplete;
			this.focus();
		}
	}

	private onInput(e: InputEvent) {
		this.value = (e.target! as HTMLTextAreaElement).value;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-message-bar': MessageBar;
	}
}
