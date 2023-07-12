import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/t-dialog';
import type TDialog from '../components/t-dialog';

const meta = {
	title: 'Component/t-dialog',
	component: 't-dialog',
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		onclose: { action: 'close' },
	},
} satisfies Meta<TDialog>;

export default meta;
type Story = StoryObj<TDialog>;

export const Dialog: Story = {
	render: ({ onclose }) =>
		html`<t-dialog title="Title" @close=${onclose}>Dialog body text</t-dialog
			>Text behind`,
};

export const WithFooter: Story = {
	render: ({ onclose }) =>
		html`<t-dialog title="Title" @close=${onclose}>
				<div>Dialog body text</div>
				<div slot="footer">Footer</div>
			</t-dialog>
			Text behind`,
};
