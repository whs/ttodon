import type { Meta, StoryObj } from '@storybook/web-components';
import {html} from "lit";
import "../components/t-app";
import type TApp from "../components/t-app";

const meta = {
  title: 't-app',
  component: 't-app',
  parameters: {
    layout: "fullscreen",
  }
} satisfies Meta<TApp>;

export default meta;
type Story = StoryObj<TApp>;

export const App: Story = {
  render: () => html`<t-app></t-app>`,
};
