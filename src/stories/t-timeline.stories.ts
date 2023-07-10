import type { Meta, StoryObj } from '@storybook/web-components';
import {html} from "lit";
import "../components/t-timeline";
import "../components/t-user-info";
import type TTimeline from "../components/t-timeline";

const meta = {
  title: 'Component/t-timeline',
  component: 't-timeline',
} satisfies Meta<TTimeline>;

export default meta;
type Story = StoryObj<TTimeline>;

export const Placeholders: Story = {
  render: () => html`<t-timeline>
    <div slot="header"><h1>Timeline</h1></div>
    <t-user-info slot="userinfo"></t-user-info>
  </t-timeline>`,
};
