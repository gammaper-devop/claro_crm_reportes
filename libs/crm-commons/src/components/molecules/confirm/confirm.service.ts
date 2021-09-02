import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ConfirmComponent } from './confirm.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  constructor(private dialog: MatDialog) {}

  open(name: any, options: MatDialogConfig = {}): Observable<any> {
    const defaultOptions = {
      autoFocus: false,
      data: name,
      disableClose: true
    };
    options = { ...defaultOptions, ...options };

    const dialog = this.dialog.open(ConfirmComponent, options);
    return dialog.afterClosed();
  }
}
