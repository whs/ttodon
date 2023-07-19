import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/t-status';
import type TStatus from '../components/t-status';
import { status } from './data';
import dayjs from 'dayjs';

const meta = {
	title: 'Component/t-status',
	component: 't-status',
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		object: { control: 'object' },
		selected: { control: 'boolean' },
	},
} satisfies Meta<TStatus>;

export default meta;
type Story = StoryObj<TStatus>;

export const BasicStatus: Story = {
	name: 'Basic status',
	args: {
			object: status,
			selected: false,
	},
	render: ({ object, selected }) =>
		html` <t-status .object="${object}" .selected="${selected}"></t-status>`,
};


export const SameDayStatus: Story = {
	name: 'Same day status',
	args: {
		object: { ...status, created_at: dayjs().toISOString() },
		selected: false,
	},
	render: ({object, selected}) =>
		html` <t-status .object="${object}" .selected="${selected}"></t-status>`,
}

export const BoostedStatus: Story = {
	name: 'Boosted status',
	args: {
		object: { ...status, reblog: status },
		selected: false,
	},
	render: ({ object, selected }) =>
		html` <t-status .object="${object}" .selected="${selected}"></t-status>`,
}

export const ReplyStatus: Story = {
	name: 'Reply status',
	args: {
		object: {...status, in_reply_to_id: status.id, in_reply_to_account_id: status.account.id},
		selected: false,
	},
	render: ({ object, selected }) =>
		html` <t-status .object="${object}" .selected="${selected}"></t-status>`,
}

export const ExternalStatus: Story = {
	name: 'Different domain status',
	args: {
		object: {...status, account: {...status.account, acct: 'whs@test.storybook'}},
		selected: false
	},
	render: ({ object, selected }) =>
		html` <t-status .object="${object}" .selected="${selected}"></t-status>`,
}
