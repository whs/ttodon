import type { Meta, StoryObj} from "@storybook/web-components";
import { html } from 'lit';
import '../components/t-acct';
import type TAcct from '../components/t-acct';

const meta = {
  title: 'Component/t-acct',
  component: 't-acct',
  argTypes: {
    acct: {
      control: 'text'
    },
  },
} satisfies Meta<TAcct>

export default meta;
type Story = StoryObj<TAcct>

export const InternalAccount: Story = {
  name: 'Account (Internal)',
  args: {
    acct: 'hellotest',
  },
  render: ({acct}) => html`<t-acct acct="${acct}"></t-acct>`
}

export const ExternalAccount: Story = {
  name: 'Account (external)',
  args: {
    acct: 'helloworld@somewhere',
  },
  render: ({acct}) => html`<t-acct acct="${acct}"></t-acct>`
}