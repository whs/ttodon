import { decode } from 'blurhash';
import { css, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('t-blurhash')
export default class Blurhash extends LitElement {
	static styles = css`
		canvas {
			width: 100%;
			height: 100%;
		}
	`;

	@property({ type: Number })
	width: number = 0;

	@property({ type: Number })
	height: number = 0;

	@property()
	blurhash: string = '';

	render() {
		let pixels = decode(this.blurhash, this.width, this.height);

		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d')!;
		let imageData = ctx.createImageData(this.width, this.height);
		imageData.data.set(pixels);
		ctx.putImageData(imageData, 0, 0);

		return canvas;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		't-blurhash': Blurhash;
	}
}
