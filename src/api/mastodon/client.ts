import axios, { AxiosInstance } from 'axios';
import {
	MastodonApplication,
	MastodonStatus,
	OAuthTokenResponse,
} from './types.ts';
import { BehaviorSubject, from, map } from 'rxjs';
import { AllowedEvent, BATCH_UPDATE_EVENT } from '../../model/timeline.ts';

export default class MastodonClient {
	protected readonly clientName = 'TTodon';
	protected readonly oauthScopes = ['read', 'write', 'push'];
	protected readonly oauthWebsite = 'https://github.com/whs/ttodon';

	hasUserToken = new BehaviorSubject(false);

	protected client: AxiosInstance;
	protected applicationInfo: MastodonApplication | undefined;

	constructor(server: URL) {
		this.client = axios.create({
			baseURL: server.toString(),
		});
	}

	getBaseUrl() {
		return this.client.defaults.baseURL!;
	}

	getOauthRedirectUri(): string {
		let url = new URL(window.location.toString());
		url.hash = '';
		url.search = '';
		url.searchParams.set('server', this.getBaseUrl());
		return url.toString();
	}

	async registerOauthApp(): Promise<MastodonApplication> {
		let resp = await this.client.post(
			'api/v1/apps',
			new URLSearchParams({
				client_name: this.clientName,
				redirect_uris: this.getOauthRedirectUri(),
				scopes: this.oauthScopes.join(' '),
				website: this.oauthWebsite,
			})
		);
		let out = resp.data;
		this.loadOAuthClientInfo(out);
		return out;
	}

	getAuthorizeUrl(): string {
		let out = new URL('oauth/authorize', new URL(this.getBaseUrl()));

		out.searchParams.set('response_type', 'code');
		out.searchParams.set('client_id', this.applicationInfo!.client_id!);
		out.searchParams.set('redirect_uri', this.getOauthRedirectUri());
		out.searchParams.set('scope', this.oauthScopes.join(' '));

		return out.toString();
	}

	loadOAuthClientInfo(info: MastodonApplication) {
		this.applicationInfo = info;
	}

	async exchangeCode(code: string): Promise<OAuthTokenResponse> {
		let resp = await this.client.post(
			'oauth/token',
			new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				client_id: this.applicationInfo!.client_id!,
				client_secret: this.applicationInfo!.client_secret!,
				redirect_uri: this.getOauthRedirectUri(),
				scope: this.oauthScopes.join(' '),
			})
		);
		let data = resp.data as OAuthTokenResponse;
		this.loadOAuthUserToken(data);

		return data;
	}

	loadOAuthUserToken(user: OAuthTokenResponse) {
		this.client.defaults.headers.common[
			'Authorization'
		] = `Bearer ${user.access_token}`;
		this.hasUserToken.next(true);
	}

	loadHomeTimeline(opts: { limit?: string; min_id?: string } = {}) {
		return from(
			this.client.get('api/v1/timelines/home', {
				params: {
					limit: '40',
					...opts,
				},
			})
		).pipe(
			map(
				(items) =>
					({
						event: BATCH_UPDATE_EVENT,
						data: (items.data as MastodonStatus[]).reverse(),
					}) as AllowedEvent
			)
		);
	}
}
