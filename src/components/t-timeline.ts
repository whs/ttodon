import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";

export interface Scrollable {
	scrollTo(x: number, y: number): void,
}

/**
 * Timeline component
 * Ported from .tweet-display
 */
@customElement("t-timeline")
export default class Timeline extends LitElement {
	@property({})
	scrollParent: Scrollable = window;

	static styles = css`
      :host {
        display: block;
        padding: 66vh 0px 66vh;
        position: relative;
      }

      .menu-item {
        line-height: normal;
      }
	`;

	render() {
		return html`
            <slot name="header"></slot>
            <slot name="userinfo"></slot>
			<slot name="status"></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"t-timeline": Timeline;
	}
}
