import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import './t-button';

@customElement('t-user-info')
export default class UserInfo extends LitElement {
	static styles = css`
		:host {
			display: block;
			overflow: hidden;
			padding: 7px;
			height: auto;
		}

		.title {
			text-transform: uppercase;
			font-weight: bold;
			font-size: 7pt;
			color: #898785;
		}

		.wrap {
			animation: 0.8s slidein ease-out;
			border: 2px solid #494847;
			max-width: 32em;
			width: fit-content;
			margin: 0 auto;
			background: #252423;
			text-align: center;
			font-size: 9pt;
			padding: 3px 6px 0;
		}

		.about-text {
			line-height: 1.4;
			padding-left: 1ex;
			padding-right: 1ex;
		}

		.realname {
			font-weight: bold;
		}

		.realname,
		.stats {
			display: inline-block;
			margin-top: 2px;
			white-space: nowrap;
		}

		.stats {
			margin-left: 1ex;
			margin-right: 1ex;
			font-size: 8pt;
		}

		.bio {
			color: #999;
			font-size: 8pt;
			margin-top: 2px;
		}

		t-button {
			line-height: normal;
		}

		@keyframes slidein {
			from {
				margin-top: -100%;
			}

			to {
				margin-top: 0;
			}
		}
	`;

	render() {
		return html` <div class="wrap">
			<div class="title">user information</div>
			<div class="text">
				<span class="realname">real name</span>
				<div class="stats">(50 followings, 100 followers)</div>
				<div class="bio">bio</div>
				<t-button>view full profile</t-button>
				<t-button>follow</t-button>
			</div>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-user-info': UserInfo;
	}
}
