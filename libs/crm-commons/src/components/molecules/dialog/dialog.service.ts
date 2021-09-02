import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open(
    component: ComponentType<{}>,
    options: MatDialogConfig = {},
  ): Promise<any> {
    const defaultOptions = {
      autoFocus: false,
      data: name,
      disableClose: true,
    };
    options = { ...defaultOptions, ...options };

    const dialog = this.dialog.open(component, options);
    return dialog.afterClosed().toPromise();
  }
}
