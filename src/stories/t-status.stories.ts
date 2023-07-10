import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from "lit";
import "../components/t-status";
import type TStatus from "../components/t-status";
import {Note} from "../activitypub/types.ts";

const status: Note = {
	"@context": [
		"https://www.w3.org/ns/activitystreams",
		{
			"ostatus": "http://ostatus.org#",
			"atomUri": "ostatus:atomUri",
			"inReplyToAtomUri": "ostatus:inReplyToAtomUri",
			"conversation": "ostatus:conversation",
			"sensitive": "as:sensitive",
			"toot": "http://joinmastodon.org/ns#",
			"votersCount": "toot:votersCount",
			"blurhash": "toot:blurhash",
			"focalPoint": {
				"@container": "@list",
				"@id": "toot:focalPoint"
			}
		}
	],
	"id": "https://mastodon.in.th/users/whs/statuses/110690069764638362",
	"type": "Note",
	"published": "2023-07-10T13:40:25Z",
	"url": "https://mastodon.in.th/@whs/110690069764638362",
	"attributedTo": "https://mastodon.in.th/users/whs",
	"to": [
		"https://www.w3.org/ns/activitystreams#Public"
	],
	"cc": [
		"https://mastodon.in.th/users/whs/followers"
	],
	"atomUri": "https://mastodon.in.th/users/whs/statuses/110690069764638362",
	"conversation": "tag:mastodon.in.th,2023-07-10:objectId=7607320:objectType=Conversation",
	"content": "<p>powered by Lit 🔥</p>",
	"contentMap": {
		"th": "<p>powered by Lit 🔥</p>"
	},
	"attachment": [
		{
			"type": "Document",
			"mediaType": "image/png",
			"url": "https://mastodon-thailand.sgp1.digitaloceanspaces.com/media_attachments/files/110/690/069/037/058/288/original/e7e8c53d967ba25d.png",
			"blurhash": "U98;Y_9eItWF03-;%Mt7%LV@WBay?ER5V?V@",
			"width": 756,
			"height": 546
		}
	],
	"tag": [],
	"replies": {
		"id": "https://mastodon.in.th/users/whs/statuses/110690069764638362/replies",
		"type": "Collection",
		"first": {
			"type": "CollectionPage",
			"next": "https://mastodon.in.th/users/whs/statuses/110690069764638362/replies?only_other_accounts=true&page=true",
			"partOf": "https://mastodon.in.th/users/whs/statuses/110690069764638362/replies",
			"items": []
		}
	}
};

const meta = {
	title: 'Component/t-status',
	component: 't-status',
	parameters: {
		layout: "centered",
	},
	args: {
		object: status,
	},
	argTypes: {
		object: {control: "object"},
	},
} satisfies Meta<TStatus>;

export default meta;
type Story = StoryObj<TStatus>;

export const Status: Story = {
	render: ({object}) => html`
        <t-status .object="${object}"></t-status>`,
};
