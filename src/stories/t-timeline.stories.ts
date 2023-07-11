import type { Meta, StoryObj } from '@storybook/web-components';
import { html, LitElement } from 'lit';
import '../components/t-timeline';
import '../components/t-user-info';
import type TTimeline from '../components/t-timeline';
import { status } from './data.ts';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

const meta = {
	title: 'Component/t-timeline',
	component: 't-timeline',
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		selected: 0,
		scrollOffset: 100,
		topPad: 0,
		bottomPad: 0,
	},
	argTypes: {
		selected: {
			control: {
				type: 'range',
				min: 0,
				max: 6,
			},
		},
		scrollOffset: {
			control: {
				type: 'number',
				min: 0,
			},
		},
		topPad: {
			control: {
				type: 'number',
				min: 0,
			},
		},
		bottomPad: {
			control: {
				type: 'number',
				min: 0,
			},
		},
	},
} satisfies Meta<TTimeline>;

export default meta;
type Story = StoryObj<TTimeline>;

export const WithoutUserInfo: Story = {
	render: ({ scrollOffset, topPad, bottomPad, selected }) =>
		html` <t-timeline
			scrolloffset="${scrollOffset}"
			toppad="${topPad}"
			bottomPad="${bottomPad}"
			selected="${selected}"
		>
			<div slot="header"><h1>Timeline</h1></div>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
		</t-timeline>`,
};

export const WithUserInfo: Story = {
	render: ({ scrollOffset, topPad, bottomPad, selected }) =>
		html` <t-timeline
			scrolloffset="${scrollOffset}"
			toppad="${topPad}"
			bottomPad="${bottomPad}"
			selected="${selected}"
		>
			<div slot="header"><h1>Timeline</h1></div>
			<t-user-info slot="header"></t-user-info>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
			<t-status .object="${status}"></t-status>
		</t-timeline>`,
};

const arrayOf10k: number[] = [];
for (let i = 0; i < 10000; i++) {
	arrayOf10k.push(i);
}

@customElement('storybook-timeline-in-container')
class TimelineInContainer extends LitElement {
	@property()
	args!: Partial<TTimeline> & { height: number; scrollable: boolean };

	containerRef = createRef<HTMLDivElement>();

	render() {
		return html`<style>
				.container {
					border: #232425 solid 1px;
					width: 400px;
					height: ${this.args.height}px;
					overflow: ${this.args.scrollable ? 'auto' : 'hidden'};
				}
			</style>
			<div class="container" ${ref(this.containerRef)}>
				${this.containerRef.value &&
				html`<t-timeline
					scrolloffset="${this.args.scrollOffset}"
					toppad="${this.args.topPad}"
					bottomPad="${this.args.bottomPad}"
					selected="${this.args.selected}"
					.scrollParent="${this.containerRef.value}"
				>
					${repeat(
						arrayOf10k,
						(item) => item,
						() => html`<t-status .object="${status}"></t-status>`
					)}
				</t-timeline>`}
			</div>`;
	}

	protected firstUpdated() {
		this.requestUpdate();
	}
}

export const InContainer: StoryObj<TTimeline & TimelineInContainer> = {
	render: (args) =>
		html`<storybook-timeline-in-container
			.args=${args}
		></storybook-timeline-in-container>`,
	args: {
		height: 400,
		scrollable: false,
	} as any,
	argTypes: {
		height: { control: { type: 'range', min: 150, max: 1000 } },
		selected: {
			control: {
				type: 'range',
				min: 0,
				max: 10000 - 1,
			},
		},
		scrollable: {
			control: { type: 'boolean' },
		},
	} as any,
	parameters: {
		layout: 'centered',
	},
};

export const WithNonStatus: Story = {
	render: ({ scrollOffset, topPad, bottomPad, selected }) =>
		html` <style>
				.item {
					background: #888;
					padding: 32px 16px;
				}
				.item:nth-child(odd) {
					background: transparent;
				}
				.item[selected] {
					font-weight: bold;
					outline: cornflowerblue solid 2px;
					box-shadow: cornflowerblue 0px 0px 50px;
				}
			</style>
			<t-timeline
				scrolloffset="${scrollOffset}"
				toppad="${topPad}"
				bottomPad="${bottomPad}"
				selected="${selected}"
			>
				<div slot="header"><h1>Timeline</h1></div>
				<div class="item">Item 1</div>
				<div class="item">Item 2</div>
				<div class="item">Item 3</div>
				<div class="item">Item 4</div>
				<div class="item">Item 5</div>
				<div class="item">Item 6</div>
				<div class="item">Item 7</div>
			</t-timeline>`,
};
