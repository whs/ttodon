import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../components/t-dialog';
import { createRef, ref } from 'lit/directives/ref.js';
import { formStyle } from '../styles';
import * as clientModel from '../model/client';

const DEFAULT_SERVER_URL = 'https://mastodon.social';

@customElement('t-login-dialog')
export default class LoginDialog extends LitElement {
	static styles = [
		formStyle,
		css`
			form {
				text-align: left;
				padding: 0 16px;
			}
			.disabled {
				cursor: wait;
			}
			.error {
				color: #ff9999;
				margin-top: 7px;
			}
		`,
	];

	serverUrlRef = createRef<HTMLInputElement>();

	@state()
	loggingIn = false;
	@state()
	error: string | undefined = undefined;

	render() {
		return html`<t-dialog
			title="Login"
			class="${classMap({ disabled: this.loggingIn })}"
		>
			<form action="" @submit=${this.onSubmit}>
				<label>
					Mastodon server URL:
					<input
						type="url"
						name="url"
						placeholder="${DEFAULT_SERVER_URL}"
						.disabled="${this.loggingIn}"
						${ref(this.serverUrlRef)}
					/>
				</label>
				${this.error && html`<div class="error">${this.error}</div>`}
				<div class="centered-button">
					<input
						type="submit"
						class="full"
						value="${this.loggingIn ? 'Logging in...' : 'Login'}"
						.disabled="${this.loggingIn}"
					/>
				</div>
			</form>
		</t-dialog>`;
	}

	protected async firstUpdated() {
		await this.updateComplete;
		this.serverUrlRef.value!.focus();
	}

	protected async onSubmit(e: SubmitEvent) {
		e.preventDefault();

		this.loggingIn = true;

		try {
			var server = new URL(
				this.serverUrlRef.value?.value || DEFAULT_SERVER_URL
			);
		} catch (e) {
			this.loggingIn = false;
			this.error = 'Cannot parse server URL';
			return;
		}

		try {
			await clientModel.setServer(server);
			let client = clientModel.instance.value!;
			window.location.assign(client.getAuthorizeUrl());
		} catch (e: any) {
			this.loggingIn = false;
			this.error = e.toString();
			return;
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-login-dialog': LoginDialog;
	}
}
