import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MicroAppLoaderService } from './microapp-loader.service';

@Component({
  selector: 'crm-microapp-outlet',
  template: ''
})
export class MicroAppLoaderComponent implements OnInit, OnDestroy {
  public isLoading: boolean;
  private microappTag: string | null;
  private unsubscribe: Subject<void> = new Subject();

  public constructor(
    private readonly microappLoader: MicroAppLoaderService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {
    // SE OBTIENE EL TAG A PARTIR DE LA RUTA DEL MICROAPP
    this.isLoading = false;
    // this.productTag = this.route.snapshot.paramMap.get('product');
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public ngOnInit() {
    this.loadMicro();
  }

  private async loadMicro() {
    this.route.data.subscribe(data => {
      this.microappTag = data.microName;
      this.isLoading = true;
      this.microappLoader
        .render(this.microappTag)
        .then(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        })
        .catch(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        });
    });
  }
}
