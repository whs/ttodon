import {css, html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";

/**
 * Message bar
 * Ported from thaiWitter #tweet-bar
 */
@customElement("t-message-bar")
export default class MessageBar extends LitElement {
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
        -webkit-appearance: none;
        outline: none;
	  }
	`;

	render() {
		return html`
            <textarea cols="100" rows="2" autofocus></textarea>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"t-message-bar": MessageBar;
	}
}
