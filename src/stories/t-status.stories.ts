import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/t-status';
import type TStatus from '../components/t-status';
import { status } from './data.ts';

const meta = {
	title: 'Component/t-status',
	component: 't-status',
	parameters: {
		layout: 'centered',
	},
	args: {
		object: status,
		selected: false,
	},
	argTypes: {
		object: { control: 'object' },
		selected: { control: 'boolean' },
	},
} satisfies Meta<TStatus>;

export default meta;
type Story = StoryObj<TStatus>;

export const Status: Story = {
	render: ({ object, selected }) =>
		html` <t-status .object="${object}" .selected="${selected}"></t-status>`,
};
