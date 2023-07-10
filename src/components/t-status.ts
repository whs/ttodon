import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ASObject} from "../activitypub/types.ts";
// TODO: Don't use this!!!
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

/**
 * Ported from Item class
 */
@customElement("t-status")
export default class Status extends LitElement {
	@property()
	object!: ASObject;

	static styles = css`
      .status {
        display: flex;
        padding: 3px 20px;
      }

      .avatar {
        width: 24px;
        height: 24px;
        margin: 4px 0;
        background: #000;
        border: 1px solid #666666;
        cursor: pointer;
      }

      .content {
        margin-left: 16px;
        min-height: 34px;
      }

      .username {
        color: #bef;
        font-weight: bold;
		text-decoration: underline;
	  }

      .meta {
        color: #707172;
        font-size: 0.8em;
      }
	  
	  .text {
		word-wrap: break-word;
	  }
	  
	  .text p { /* TODO: Remove */
		display: inline;
	  }
	`;

	render() {
		// TODO: status-mention status-faved status-filtered status-highed status-selected
		// TODO: Don't use unsafeHTML
		return html`
            <div class="status">
                <img class="avatar" src="https://picsum.photos/200/200">
                <div class="content">
                    <span class="username">awkwin</span>
                    <span class="text">${unsafeHTML(this.object.content)}</span>
                    <span class="meta">meta<slot name="metadata"></slot></span>
                </div>
            </div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"t-status": Status;
	}
}
