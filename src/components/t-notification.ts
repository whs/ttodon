import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Ported from notify()
@customElement('t-notification')
export default class TNotification extends LitElement {
	static styles = css`
		:host {
			display: block;
			background: black;
			padding: 6px;
			margin-top: 10px;
			width: fit-content;
			position: relative;
			--hide-duration: 3000ms;
			animation:
				1s ease-out reveal,
				1s ease-in var(--hide-duration) remove forwards;
		}

		@keyframes reveal {
			from {
				left: -100vw;
			}
			to {
				left: 0;
			}
		}

		@keyframes remove {
			from {
				left: 0;
				margin-bottom: 0;
			}
			to {
				left: calc(var(--width) + 20px);
				margin-bottom: calc(-1 * var(--height) - 10px);
			}
		}
	`;

	/**
	 * How long in milliseconds to hide this element.
	 * Defaults to 3000. Set to 0 or falsy value to never hide
	 */
	@property({ type: Number })
	hide: number = 3000;

	@property({ type: Boolean })
	autoRemove: boolean = true;

	constructor() {
		super();
		this.addEventListener('animationend', this.onAnimationEnd);
	}

	render() {
		if (!this.hide) {
			this.style.setProperty('animation', '1s ease-out reveal');
		} else {
			this.style.setProperty('--hide-duration', `${this.hide}ms`);
		}

		return html`<slot @slotchange=${this.onSlotChange}></slot>`;
	}

	protected onSlotChange = () => {
		this.style.setProperty('--width', `${this.offsetWidth}px`);
		this.style.setProperty('--height', `${this.offsetHeight}px`);
	};

	protected onAnimationEnd = (e: AnimationEvent) => {
		if (e.animationName === 'remove') {
			this.dispatchEvent(new CustomEvent('hide'));
			if (this.autoRemove) {
				this.remove();
			}
		}
	};
}

declare global {
	interface HTMLElementTagNameMap {
		't-notification': TNotification;
	}
}
