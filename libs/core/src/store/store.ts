import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IStore } from './global';

export class Store<T> implements IStore {
  private static window = window as any;
  private state$: BehaviorSubject<T>;

  protected constructor() {
    this.state$ = new BehaviorSubject<any>(null);
  }

  static getInstance(): IStore {
    if (!this.window.store) {
      this.window.store = new Store();
    }

    return this.window.store;
  }

  setState(nextState: T): void {
    this.state$.next(nextState);
  }

  getState(): Observable<T> {
    return this.state$.asObservable();
  }

  getValue(): T {
    return this.state$.getValue();
  }
}
