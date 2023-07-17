import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import {
	animationFrameScheduler,
	BehaviorSubject,
	Observable,
	subscribeOn,
	Subscription,
} from 'rxjs';
import { noChange } from 'lit';

/**
 * A directive that act as the value of an Observable.
 *
 * Initially the directive is not rendered, except if the provided observable is a BehaviorSubject then the current
 * value is used. After that, an update will be pushed every time the observable fires.
 *
 * Note that Lit directives do not call render() in components - the rendered DOM will be updated directly.
 * Use a reactive controller if you need to run component logic.
 */
class RxDirective<T> extends AsyncDirective {
	private observable?: Observable<T>;
	private subscription?: Subscription;

	render(observable: Observable<T>) {
		if (this.observable !== observable) {
			this.subscription?.unsubscribe();
			this.observable = observable;

			if (this.isConnected) {
				this.subscribe();
			}

			if (observable instanceof BehaviorSubject) {
				return observable.value;
			}
		}

		return noChange;
	}

	private subscribe() {
		this.subscription = this.observable!.pipe(
			subscribeOn(animationFrameScheduler)
		).subscribe((next) => {
			this.setValue(next);
		});
	}

	disconnected() {
		this.subscription?.unsubscribe();
	}
	reconnected() {
		this.subscribe();
	}
}

export default directive(RxDirective);
