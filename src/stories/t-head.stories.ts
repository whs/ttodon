import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/t-head';
import '../components/t-hotkey';
import type THead from '../components/t-head';

const meta = {
	title: 'Component/t-head',
	component: 't-head',
} satisfies Meta<THead>;

export default meta;
type Story = StoryObj<THead>;

export const Head: Story = {
	render: () =>
		html` <t-head>
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
			<t-button> ▼ </t-button>

			<t-menu-item slot="right" title="Position">0 / 100</t-menu-item>
			<t-menu-item slot="right" title="Status Text Limit">140</t-menu-item>
		</t-head>`,
};
