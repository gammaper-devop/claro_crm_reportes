import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorResponse, ErrorCodes, EErrorType } from '@claro/crm/commons';
import { User } from '@shell/app/core';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-error-step',
  templateUrl: './error-step.component.html',
  styleUrls: ['./error-step.component.scss'],
})
export class ErrorStepComponent implements OnInit {
  @Input() user: User;
  @Input() error: ErrorResponse;
  cdn = environment.cdn;
  title = 'Error en el sistema';
  description = '';

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.error) {
      if (this.error.errorType === EErrorType.Functional) {
        this.title = 'Error de datos';
      }
      this.description = ErrorCodes[this.error.code];
    }
  }

  refresh() {
    const currentRoute = this.router.url.substr(1);
    this.router.navigate(['reload'], { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]).then();
    });
  }
}
