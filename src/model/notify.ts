import { HTMLTemplateResult } from 'lit';
import { createContext } from '@lit/context';
import { Subject } from 'rxjs';

export interface Notification {
	text: string | HTMLElement | HTMLTemplateResult;
}

export const notificationStreamContext =
	createContext<Subject<Notification>>('notification');
