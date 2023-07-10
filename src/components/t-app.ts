import {css, html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import "./t-head";
import "./t-hotkey";
import "./t-button";
import "./t-timeline";
import "./t-status";
import "./t-message-bar";

/**
 * Main UI
 */
@customElement("t-app")
export default class App extends LitElement {
	static styles = css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .head {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
		z-index: 1;
      }

      .message-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
      }

      .welcome {
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 2px solid #444;
      }
	`;

	render() {
		return html`
            <div class="head">
                <t-head>
                    <t-button>
                        <t-hotkey hotkey="R">Refresh</t-hotkey>
                    </t-button>
                    <t-button>
                        <t-hotkey hotkey="T" hotkeyindex="6">Retweet</t-hotkey>
                    </t-button>
                    <t-button>
                        <t-hotkey hotkey="Y">Reply</t-hotkey>
                    </t-button>
                    <t-button>
                        <t-hotkey hotkey="E">Fave</t-hotkey>
                    </t-button>
                    <t-button>
                        ▼
                    </t-button>

                    <t-menu-item slot="right" title="Position">0 / 100</t-menu-item>
                    <t-menu-item slot="right" title="Status Text Limit">140</t-menu-item>
                </t-head>
            </div>
            <t-timeline>
                <div class="welcome" slot="header">
                    <strong>thaiWitter</strong> [Version 3.0.10*]
                </div>
				<t-status slot="status"></t-status>
				<t-status slot="status"></t-status>
				<t-status slot="status"></t-status>
            </t-timeline>
            <div class="message-bar">
                <t-message-bar></t-message-bar>
            </div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"t-app": App;
	}
}
