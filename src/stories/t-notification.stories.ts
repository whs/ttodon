import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/t-notification';
import '../components/t-notification-area';
import type TNotification from '../components/t-notification';

const meta = {
	title: 'Component/t-notification',
	component: 't-notification',
	args: {
		hide: 3000,
	},
	argTypes: {
		hide: {
			control: {
				type: 'range',
				min: 0,
				max: 10000,
			},
		},
	},
} satisfies Meta<TNotification>;

export default meta;
type Story = StoryObj<TNotification>;

export const SingleLine: Story = {
	render: ({ hide }) =>
		html`<t-notification-area
			><t-notification hide="${hide}"
				>Message</t-notification
			></t-notification-area
		>`,
};

export const Multiple: Story = {
	render: ({ hide }) =>
		html`<t-notification-area>
			<t-notification hide="${hide}">Line 1<br />Line 2</t-notification>
			<t-notification hide="${hide}"
				>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
				risus.</t-notification
			>
		</t-notification-area>`,
};
