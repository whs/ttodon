import type { Meta, StoryObj } from '@storybook/web-components';
import {html} from "lit";
import "../components/t-message-bar";
import type TMessageBar from "../components/t-message-bar";

const meta = {
  title: 'Component/t-message-bar',
  component: 't-message-bar',
  parameters: {
    layout: "centered",
  },
} satisfies Meta<TMessageBar>;

export default meta;
type Story = StoryObj<TMessageBar>;

export const TweetBar: Story = {
  render: () => html`<t-message-bar></t-message-bar>`,
};
