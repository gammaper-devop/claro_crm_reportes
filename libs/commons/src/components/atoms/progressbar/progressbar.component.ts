import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProgressbarService } from './progressbar.service';

@Component({
  selector: 'claro-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
})
export class ProgressbarComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Input() show = false;
  @Input() value = 0;
  @Input() mode = 'indeterminate';

  constructor(private progressbarService: ProgressbarService) {}

  ngOnInit() {
    this.subscription = this.progressbarService.isLoading.subscribe(
      async (isLoading: boolean) => {
        this.show = await isLoading;
      },
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
