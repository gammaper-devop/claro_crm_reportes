import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressbarService {
  private loadingCounter = 0;
  private loading = new BehaviorSubject<boolean>(false);
  isLoading = this.loading.asObservable();

  constructor() {}

  show() {
    this.onAction(1);
  }

  hide() {
    this.onAction(-1);
  }

  private onAction(increment: number) {
    this.loadingCounter += increment;
    if (this.loadingCounter === 1) {
      this.loading.next(true);
    } else if (this.loadingCounter === 0) {
      setTimeout(() => {
        if (this.loadingCounter === 0) {
          this.loading.next(false);
        }
      });
    }
  }
}
