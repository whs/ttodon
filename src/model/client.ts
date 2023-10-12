import { BehaviorSubject } from 'rxjs';
import MastodonClient from '../api/mastodon/client';

export const instance = new BehaviorSubject<MastodonClient | undefined>(
	undefined
);

/**
 * Username of current access token (may not be logged in if AT is missing)
 */
export const username = new BehaviorSubject<string | undefined>(undefined);

export async function setServer(newServer: string | URL) {
	if (!(newServer instanceof URL)) {
		newServer = new URL(newServer);
	}

	let client = new MastodonClient(newServer);
	instance.next(client);
	if (hasServerInfo(newServer)) {
		client.loadOAuthClientInfo(
			JSON.parse(localStorage[getApplicationInfoKey(newServer)])
		);

		if (localStorage[getUserTokenKey(newServer)]) {
			client.loadOAuthUserToken(
				JSON.parse(localStorage[getUserTokenKey(newServer)])
			);
		}
	} else {
		let app = await client.registerOauthApp();
		localStorage[getApplicationInfoKey(newServer)] = JSON.stringify(app);
	}
}

export async function exchangeCode(code: string) {
	let codeResponse = await instance.value!.exchangeCode(code);
	localStorage[getUserTokenKey(instance.value!.getBaseUrl())] =
		JSON.stringify(codeResponse);
}

export function storeLastServerUsed() {
	localStorage['lastServer'] = instance.value?.getBaseUrl();
}

export function getLastServerUsed(): string | undefined {
	return localStorage['lastServer'];
}

export function hasServerInfo(server: URL) {
	return localStorage[getApplicationInfoKey(server)] !== undefined;
}

function getApplicationInfoKey(server: URL | string) {
	return `applicationInfo.${server.toString()}`;
}

function getUserTokenKey(server: URL | string) {
	return `userToken.${server.toString()}`;
}
