import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/t-button';
import type TButton from '../components/t-button';

const meta = {
	title: 'Component/t-button',
	component: 't-button',
	argTypes: {
		onclick: { action: 'click' },
	},
} satisfies Meta<TButton>;

export default meta;
type Story = StoryObj<TButton>;

export const Button: Story = {
	render: ({ onclick }) => html`<t-button @click=${onclick}>Click</t-button>`,
};
