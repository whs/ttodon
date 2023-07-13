import { MastodonStatus } from '../api/mastodon/types';
import { interval, map } from 'rxjs';

export const status: MastodonStatus = {
	id: '110690069764638362',
	created_at: '2023-07-10T13:40:25.869Z',
	in_reply_to_id: null,
	in_reply_to_account_id: null,
	sensitive: false,
	spoiler_text: '',
	visibility: 'public',
	language: 'th',
	uri: 'https://mastodon.in.th/users/whs/statuses/110690069764638362',
	url: 'https://mastodon.in.th/@whs/110690069764638362',
	replies_count: 0,
	reblogs_count: 1,
	favourites_count: 0,
	edited_at: null,
	content: '<p>powered by Lit 🔥</p>',
	reblog: null,
	application: {
		name: 'Web',
		website: null,
	},
	account: {
		id: '16143',
		username: 'whs',
		acct: 'whs',
		display_name: 'อัคคาวิน',
		locked: false,
		bot: false,
		discoverable: false,
		group: false,
		created_at: '2020-03-05T00:00:00.000Z',
		note: '',
		url: 'https://mastodon.in.th/@whs',
		avatar: 'https://mastodon.in.th/avatars/original/missing.png',
		avatar_static: 'https://mastodon.in.th/avatars/original/missing.png',
		header: 'https://mastodon.in.th/headers/original/missing.png',
		header_static: 'https://mastodon.in.th/headers/original/missing.png',
		followers_count: 143,
		following_count: 48,
		statuses_count: 3352,
		last_status_at: '2023-07-10',
		noindex: false,
		emojis: [],
		roles: [],
		fields: [
			{
				name: 'Keybase',
				value: 'keybase.io/whs',
				verified_at: null,
			},
		],
	},
	media_attachments: [
		{
			id: '110690069037058288',
			type: 'image',
			url: 'https://mastodon-thailand.sgp1.digitaloceanspaces.com/media_attachments/files/110/690/069/037/058/288/original/e7e8c53d967ba25d.png',
			preview_url:
				'https://mastodon-thailand.sgp1.digitaloceanspaces.com/media_attachments/files/110/690/069/037/058/288/small/e7e8c53d967ba25d.png',
			remote_url: null,
			preview_remote_url: null,
			text_url: null,
			meta: {
				original: {
					width: 756,
					height: 546,
					size: '756x546',
					aspect: 1.3846153846153846,
				},
				small: {
					width: 565,
					height: 408,
					size: '565x408',
					aspect: 1.3848039215686274,
				},
			},
			description: null,
			blurhash: 'U98;Y_9eItWF03-;%Mt7%LV@WBay?ER5V?V@',
		},
	],
	mentions: [],
	tags: [],
	emojis: [],
	card: null,
	poll: null,
};

export const mockStatusStream = (every: number) =>
	interval(every).pipe(
		map((id) => {
			let outputStatus = JSON.parse(JSON.stringify(status)) as MastodonStatus;
			outputStatus.id = id.toString();
			return {
				event: 'update' as const,
				data: outputStatus,
			};
		})
	);
