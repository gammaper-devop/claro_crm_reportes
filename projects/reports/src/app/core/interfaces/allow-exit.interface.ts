import { Observable } from 'rxjs';

export interface AllowExit {
  allowExitRoute: () => Observable<boolean> | Promise<boolean> | boolean;
}