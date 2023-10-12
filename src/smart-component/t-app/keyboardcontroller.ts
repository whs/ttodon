import { ReactiveController } from 'lit';
import type App from './index';
import { keyToString } from '../t-keyboard-manager.ts';

export type KeyboardAction = string;

export default class KeyboardController implements ReactiveController {
	protected host: App;
	private registeredActions: Record<
		KeyboardAction,
		(e: KeyboardEvent) => void
	> = {};
	private registeredHotkeys: Record<string, KeyboardAction> = {};

	constructor(host: App) {
		(this.host = host).addController(this);
	}

	hostConnected() {
		document.addEventListener('keydown', this.onKeyPress);
	}

	hostDisconnected() {
		document.removeEventListener('keydown', this.onKeyPress);
	}

	getKeyForAction(action: KeyboardAction): string | undefined {
		for (let key of Object.keys(this.registeredHotkeys)) {
			if (this.registeredHotkeys[key] === action) {
				return key;
			}
		}
	}

	protected onKeyPress = (e: KeyboardEvent) => {
		let keyChar = keyToString(e);
		if (this.registeredHotkeys.hasOwnProperty(keyChar)) {
			let action = this.registeredHotkeys[keyChar];
			this.registeredActions[action](e);
		} else {
			this.onUnrecognizedKey();
		}
	};

	onUnrecognizedKey() {
		this.host.messageBar.value?.focus();
	}

	registerAction(action: string, callback: (e: KeyboardEvent) => void) {
		if (this.registeredActions.hasOwnProperty(action)) {
			console.warn(`Overriding hotkey action ${action}`);
		}
		this.registeredActions[action] = callback;
	}

	registerHotkey(hotkey: string, action: KeyboardAction) {
		if (this.registeredHotkeys.hasOwnProperty(hotkey)) {
			console.warn(`Overriding hotkey ${hotkey}`);
		}
		this.registeredHotkeys[hotkey] = action;
	}
}

const isMac = navigator.userAgent.includes('Mac OS');

const ctrlKey = 'ctrl';
const altKey = 'alt';
const winKey = 'win';
const shiftKey = 'shift';

export function keyToString(e: KeyboardEvent) {
	let out: string[] = [];
	if (isMac) {
		// Swap meta - control key on Mac
		if (e.metaKey) {
			out.push(ctrlKey);
		}
		if (e.ctrlKey) {
			out.push(winKey);
		}
	} else {
		if (e.ctrlKey) {
			out.push(ctrlKey);
		}
		if (e.metaKey) {
			out.push(winKey);
		}
	}

	if (e.altKey) {
		out.push(altKey);
	}

	if (e.shiftKey) {
		out.push(shiftKey);
	}

	out.push(e.code);
	return out.join('+');
}
