import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js';
import { createRef, ref } from 'lit/directives/ref.js';

import ScrollController, {
	Scrollable,
	ScrollableHost,
} from './scrollcontroller';

/**
 * Timeline component
 * Ported from .tweet-display
 */
@customElement('t-timeline')
export default class Timeline extends LitElement implements ScrollableHost {
	@property({ type: Number, reflect: true })
	selected: number | undefined = undefined;

	@property()
	scrollParent: Scrollable = document.documentElement;
	@property({ type: Number })
	scrollOffset = 100;
	@property({ type: Number })
	topPad = 0;
	@property({ type: Number })
	bottomPad = 0;

	static styles = css`
		:host {
			display: block;
			padding: 66vh 0px 66vh;
			position: relative;
		}

		.menu-item {
			line-height: normal;
		}

		:not([name])::slotted(*) {
			display: block;
		}
	`;

	@state()
	itemCount = 0;

	protected scrollController = new ScrollController(this);

	@queryAssignedElements()
	statuses!: HTMLElement[];

	statusSlot = createRef<HTMLSlotElement>();
	statusContainer = createRef<HTMLDivElement>();

	render() {
		return html`
			<div class="header">
				<slot name="header"></slot>
			</div>
			<div class="statuses" ${ref(this.statusContainer)}>
				<slot
					${ref(this.statusSlot)}
					@click=${this.onStatusClicked}
					@slotchange=${this.handleStatusChange}
				></slot>
			</div>
			<div class="footer">
				<slot name="footer"></slot>
			</div>
		`;
	}

	protected updated(changedProperties: PropertyValues<this>) {
		super.updated(changedProperties);

		if (changedProperties.has('selected')) {
			this.onSelectedChange(changedProperties.get('selected'), this.selected);
		}
	}

	protected onSelectedChange(
		oldValue: number | undefined,
		newValue: number | undefined
	) {
		let statuses = this.statuses;
		if (oldValue !== undefined) {
			let oldSelected = statuses[oldValue];
			oldSelected?.removeAttribute('selected');
		}

		if (newValue !== undefined) {
			let newSelected = statuses[newValue];
			newSelected?.setAttribute('selected', 'true');
		}

		this.scrollSelectedIntoView();
	}

	protected handleStatusChange(_: Event) {
		let statuses = this.statuses;
		this.itemCount = statuses.length;

		if (this.selected !== undefined) {
			let selectedStatus = statuses[this.selected];
			if (!selectedStatus || selectedStatus.hasAttribute('selected')) {
				return;
			}

			selectedStatus.setAttribute('selected', 'true');
			this.scrollSelectedIntoView();
		}
	}

	protected onStatusClicked = (e: MouseEvent) => {
		let statusNode = e.target as HTMLElement | null;
		while (
			statusNode !== null &&
			!(statusNode.parentNode != this.statusSlot.value)
		) {
			statusNode = statusNode.parentElement;
		}
		if (!statusNode) {
			console.warn('event target is not in status slot');
			return;
		}

		let index = this.statuses.indexOf(statusNode);
		if (index === -1) {
			console.warn("can't find child in status list");
			return;
		}

		this.tellParentStatusSelected(index);
	};

	/**
	 * Raise an event that we want to change selected status to the value
	 * If the event is not canceled, then perform the change
	 * @param index
	 * @protected
	 */
	protected tellParentStatusSelected(index: number) {
		const event = new CustomEvent('select', {
			bubbles: true,
			composed: true,
			detail: index,
		});
		let allowDefault = this.dispatchEvent(event);

		if (allowDefault) {
			this.selected = index;
		}
	}

	scrollSelectedIntoView() {
		if (this.selected === undefined) {
			return;
		}
		let selectedNode = this.statuses[this.selected];
		if (!selectedNode) {
			// TODO: Define better behavior
			console.warn('unable to find selected item');
			this.selected = undefined;
			return;
		}

		this.scrollController.scrollChildIntoView(selectedNode);
	}

	movePage(direction: number) {
		let visible = this.scrollController.getScrollVisibleArea();
		let target = visible.bottom - visible.top;
		let current = 0;
		let last = this.selected || 0;
		// Get the first status that is just beyond the top edge of the screen
		for (
			let i = this.selected!;
			0 <= i && i < this.statuses.length;
			i += direction
		) {
			current += this.statuses[i].offsetHeight;
			if (current > target) {
				break;
			}
			last = i;
		}

		this.tellParentStatusSelected(last);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-timeline': Timeline;
	}
}
