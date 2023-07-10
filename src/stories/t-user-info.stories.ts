import type { Meta, StoryObj } from '@storybook/web-components';
import {html} from "lit";
import "../components/t-user-info";
import type TUserInfo from "../components/t-user-info";

const meta = {
  title: 'Component/t-user-info',
  component: 't-user-info',
  parameters: {
    layout: "centered",
  },
} satisfies Meta<TUserInfo>;

export default meta;
type Story = StoryObj<TUserInfo>;

export const UserInfo: Story = {
  render: () => html`<t-user-info></t-user-info>`,
};
