import { Observable } from 'rxjs';

export interface IStore {
  setState(nextState: any): void;
  getState(): Observable<any>;
}
