import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MastodonStatus } from '../api/mastodon/types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import './t-acct';
import './t-blurhash';
import sanitize from '../lib/sanitize.ts';

dayjs.extend(utc);

/**
 * Ported from Item class
 */
@customElement('t-status')
export default class Status extends LitElement {
	@property()
	object!: MastodonStatus;

	@property({ type: Boolean, reflect: true })
	selected!: boolean;

	@property({ type: String })
	sameDayDateFormat = 'H:mm:ss';

	@property({ type: String })
	differentDayDateFormat = `YYYY-MM-DD ${this.sameDayDateFormat}`;

	static styles = css`
		:host {
			display: block;
			--paragraph-margin: 0.35em;
		}

		.status {
			display: flex;
			padding: 3px 20px;
		}

		:host([selected]) .status {
			background: #898785;
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
			width: 100%;
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

		.meta a {
			color: inherit;
			text-decoration: none;
		}

		:host([selected]) .meta {
			color: #000;
		}

		.text {
			word-wrap: break-word;
		}

		.text p {
			display: inline;
		}
		/* Mastodon use <p> for paragraph breaks */
		.text p:nth-of-type(n + 2) {
			display: block;
			margin: var(--paragraph-margin) 0;
		}
		/* Pleorama use <br><br> for paragraph breaks */
		.text > br {
			display: block;
			content: '';
			margin: calc(var(--paragraph-margin) / 2) 0;
		}

		.text a {
			color: inherit;
			cursor: pointer;
			text-decoration: none;
		}
	`;

	getCreatedDate() {
		return dayjs(this.object.created_at).local();
	}

	getDateFormat(date: dayjs.Dayjs) {
		if (date.format('YYYY-MM-DD') === dayjs().local().format('YYYY-MM-DD')) {
			return this.sameDayDateFormat;
		}
		return this.differentDayDateFormat;
	}

	render() {
		// TODO: status-mention status-faved status-filtered status-highed
		// TODO: Acct should show @ part in small text

		return html`
			<div class="status">
				<img class="avatar" src="${this.object.account.avatar}" />
				<div class="content">
					<span class="username" title="${this.object.account.display_name}"
						><t-acct acct="${this.object.account.acct}"></t-acct></span
					>${' '}
					<span class="text">${this.renderText()}</span>
					<span class="meta">
						${this.object.reblog ? html`(boost) ` : null}
						<a target="_blank" href="${this.object.url || this.object.uri}"
							>${this.getCreatedDate().format(
								this.getDateFormat(this.getCreatedDate())
							)}</a
						>
						${this.object.application &&
						(this.object.application.website
							? html` from
									<a target="_blank" href="${this.object.application.website}"
										>${this.object.application.name}</a
									>`
							: ` from ${this.object.application.name}`)}
						${this.object.in_reply_to_id &&
						html`<a href="#" @click=${this.onReplyClick}>
							&raquo; ${this.getInReplyToUsername()}</a
						>`}
						<slot name="metadata"></slot>
					</span>
				</div>
			</div>
		`;
	}

	protected renderText(status = this.object): any {
		if (status.reblog) {
			return html`<strong>Boost</strong>${' '} @<t-acct
					acct="${status.reblog.account.acct}"
				></t-acct
				>: ${this.renderText(status.reblog)}`;
		}

		return sanitize(status.content);
	}

	protected getInReplyToUsername() {
		if (!this.object.in_reply_to_account_id) {
			return null;
		}

		if (this.object.in_reply_to_account_id === this.object.account.id) {
			return this.object.account.acct;
		}

		if (this.object.mentions?.length > 0) {
			for (let mentions of this.object.mentions) {
				if (mentions.id === this.object.in_reply_to_account_id) {
					return mentions.acct;
				}
			}
		}

		return null;
	}

	private onReplyClick = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const event = new CustomEvent('replyclick', {
			bubbles: true,
			composed: true,
			detail: this.object.in_reply_to_id,
		});
		this.dispatchEvent(event);
	};
}

declare global {
	interface HTMLElementTagNameMap {
		't-status': Status;
	}
}
