import { ReactiveController, ReactiveControllerHost } from 'lit';

export interface Scrollable {
	scrollTo(x: number, y: number): void;

	scrollTop: number;
	clientHeight: number;
}

export interface ScrollableHost extends ReactiveControllerHost {
	/**
	 * The element to scroll
	 */
	scrollParent: Scrollable;

	/**
	 * When scrolling, leave this much margin from the top/bottom of the viewport to the current item
	 */
	scrollOffset: number;

	/**
	 * When scrolling, leave this much room for top of viewport elements
	 */
	topPad: number;

	/**
	 * When scrolling, leave this much room for bottom of viewport elements
	 */
	bottomPad: number;
}

export default class ScrollController implements ReactiveController {
	host: ScrollableHost;
	animationInfo:
		| {
				target: number;
				x0: number;
				v0: number;
				v: number;
				direction: -1 | 1;
				startTime: number;
		  }
		| undefined;

	constructor(host: ScrollableHost) {
		(this.host = host).addController(this);
	}

	hostConnected() {}

	get currentScroll() {
		return this.host.scrollParent.scrollTop;
	}

	/**
	 * Ported from BaseTimeline.getVisibleArea
	 */
	getScrollVisibleArea(): { top: number; bottom: number } {
		return {
			top: this.currentScroll + this.host.topPad,
			bottom:
				this.currentScroll +
				this.host.scrollParent.clientHeight -
				this.host.bottomPad,
		};
	}

	/**
	 * Ported from BaseTimeline.checkScrolling
	 */
	scrollChildIntoView(child: HTMLElement) {
		let top = child.offsetTop;
		let bottom = top + child.offsetHeight;
		let viewport = this.getScrollVisibleArea();

		if (bottom > viewport.bottom - this.host.scrollOffset) {
			// element is below, scroll up
			this.scrollTo(
				bottom -
					this.host.scrollParent.clientHeight +
					this.host.bottomPad +
					this.host.scrollOffset
			);
		} else if (top < viewport.top + this.host.scrollOffset) {
			// element is above, scroll down
			this.scrollTo(top - this.host.topPad - this.host.scrollOffset);
		}
	}

	scrollTo(y: number) {
		y = Math.max(0, y);
		this.startScrollAnimation(y);
	}

	instantScrollTo(y: number) {
		this.host.scrollParent.scrollTo(0, Math.max(0, y));
	}

	isScrolling() {
		return this.animationInfo?.v !== 0;
	}

	protected startScrollAnimation(y: number) {
		if (this.animationInfo?.target !== y) {
			this.animationInfo = {
				target: y,
				x0: Math.abs(this.currentScroll - y),
				v0: this.animationInfo?.v || 0,
				v: 0,
				direction: this.currentScroll < y ? -1 : 1,
				startTime: new Date().getTime() - 1000 / 60,
			};
		}

		if (!this.isScrolling()) {
			this.animationTick();
		}
	}

	/**
	 * Ported from BaseTimeline.scroller
	 * @link https://me.dt.in.th/page/thaiWitterScrollingEquation
	 */
	protected animationTick = () => {
		let info = this.animationInfo!!;
		let timeDelta = ((new Date().getTime() - info.startTime) / 1000) * 50;
		const coeff = 5; // acceleration coefficient
		const friction = 0.27;
		let a = -friction * -(coeff / 2);
		let b = -friction * info.v0 + coeff;
		let c = -friction * info.x0 - info.v0;
		// Quadratic formula?
		let critical = -b + Math.sqrt(b * b - 4 * a * c) / (2 * a);
		let x = 0;
		if (timeDelta >= critical) {
			x =
				(info.x0 + info.v0 * critical - (coeff / 2) * critical * critical) *
				Math.exp(-friction * (timeDelta - critical));
			info.v = -friction * x;
		} else {
			x = info.x0 + info.v0 * timeDelta - (coeff / 2) * timeDelta * timeDelta;
			info.v = info.v0 - coeff * timeDelta;
		}
		if (timeDelta >= critical && info.v > -0.2) {
			info.v = 0;
			this.instantScrollTo(info.target);
		} else {
			let scrollTarget = Math.round(info.target + info.direction * x);
			this.instantScrollTo(scrollTarget);
			requestAnimationFrame(this.animationTick);
		}
	};
}
