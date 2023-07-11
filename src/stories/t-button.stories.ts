import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/t-button';
import type TButton from '../components/t-button';

const meta = {
	title: 'Component/t-button',
	component: 't-button',
} satisfies Meta<TButton>;

export default meta;
type Story = StoryObj<TButton>;

export const Button: Story = {
	render: () => html`<t-button>Click</t-button>`,
};
