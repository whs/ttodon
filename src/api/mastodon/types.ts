export interface MastodonStatus {
	id: string;
	uri: string;
	created_at: string;
	account: Account;
	content: string;
	visibility: 'public' | 'unlisted' | 'private' | 'direct';
	sensitive: boolean;
	spoiler_text: string;
	media_attachments: MediaAttachments[];
	application?: Record<string, any>;
	mentions: StatusMention[];
	tags: StatusTag[];
	emojis: CustomEmoji[];
	reblogs_count: number;
	favourites_count: number;
	replies_count: number;
	url: string | null;
	in_reply_to_id: string | null;
	reblog: MastodonStatus | null;
	poll: Poll | null;
	card: PreviewCard | null;
	language: string | null;
	text?: string | null;
	edited_at: string | null;
	favourited?: boolean;
	reblogged?: boolean;
	muted?: boolean;
	bookmarked?: boolean;
	pinned?: boolean;

	// filtered?: FilterResult[],

	[key: string]: any;
}

export interface StatusMention {
	id: string;
	username: string;
	url: string;
	acct: string;
}

export interface StatusTag {
	name: string;
	url: string;
}

export interface Account {
	id: string;
	username: string;
	acct: string;
	url: string;
	display_name: string;
	note: string;
	avatar: string;
	avatar_static: string;
	header: string;
	header_static: string;
	locked: boolean;
	fields: ProfileField[];
	emojis: CustomEmoji[];
	bot: boolean;
	group: boolean;
	discoverable: boolean | null;
	noindex?: boolean | null;
	moved?: Account | null;
	suspended?: boolean;
	limited?: boolean;
	created_at: string;
	last_status_at: string | null;
	statuses_count: number;
	followers_count: number;
	following_count: number;

	[key: string]: any;
}

export interface ProfileField {
	name: string;
	value: string;
	verified_at: string | null;

	[key: string]: any;
}

export interface MediaAttachments {
	id: string;
	type: 'unknown' | 'image' | 'gifv' | 'video' | 'audio';
	url: string;
	preview_url: string;
	remote_url: string | null;
	meta: Record<string, any>;
	description: string | null;
	blurhash: string;

	[key: string]: any;
}

export interface CustomEmoji {
	shortcode: string;
	url: string;
	static_url: string;
	visible_in_picker: boolean;
	category: string;
}

export interface Poll {
	id: string;
	expires_at: string | null;
	expired: boolean;
	multiple: boolean;
	votes_count: number;
	voters_count: number | null;
	options: PollOption[];
	emojis: CustomEmoji[];
	voted?: boolean;
	own_votes?: number[];

	[key: string]: any;
}

export interface PollOption {
	title: string;
	votes_count: number | null;
}

export interface PreviewCard {
	url: string;
	title: string;
	description: string;
	type: 'link' | 'photo' | 'video' | 'rich';
	author_name: string;
	author_url: string;
	provider_name: string;
	provider_url: string;
	html: string;
	width: number;
	height: number;
	image: string | null;
	embed_url: string;
	blurhash: string | null;
}
