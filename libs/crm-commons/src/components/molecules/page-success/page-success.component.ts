import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { ErrorResponse } from '../../../interfaces';

@Component({
  selector: 'crm-page-success',
  templateUrl: './page-success.component.html',
  styleUrls: ['./page-success.component.scss'],
})
export class PageSuccessComponent implements AfterViewInit{

  @ViewChild('inputContent', { static: true }) inputContent: ElementRef<HTMLElement>;
  @Input() fullscreen = false;
  @Input() top = false;
  @Input() error: ErrorResponse;
  showDefaultContent = false;

  constructor(
    private router: Router,
  ) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showDefaultContent = this.inputContent.nativeElement.childNodes.length === 0;
    });
  }

  refreshPage() {
    const currentRoute = this.router.url.substr(1);
    this.router.navigate(['reload']).then(() => {
      this.router.navigate([currentRoute]).then();
    });
  }

}
