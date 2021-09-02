import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Messages } from '../../../global';
import { SnackbarComponent } from './snackbar.component';

interface SnackbarOptions {
  duration?: number;
  autoClose?: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(public snackBar: MatSnackBar) {}

  show(
    data: any,
    type: 'success' | 'error' | 'warning' | 'info',
    options?: SnackbarOptions
  ) {
    const config = new MatSnackBarConfig();
    this.style(config, type);
    const defaultOptions = {
      duration: 4000,
      autoClose: true,
      data: this.message(data)
    };
    options = { ...defaultOptions, ...options };
    if (options.autoClose) {
      config.duration = options.duration;
    }
    config.verticalPosition = 'top';
    config.data = options;
    this.snackBar.openFromComponent(SnackbarComponent, config);
  }

  hide() {
    this.snackBar.dismiss();
  }

  private message(data: any) {
    const message = Object.keys(Messages).find(
      item =>
        typeof data === 'string' && data.toLowerCase() === item.toLowerCase()
    );
    return message ? Messages[message] : data;
  }

  private style(
    config: MatSnackBarConfig,
    type: 'success' | 'error' | 'warning' | 'info'
  ) {
    switch (type) {
      case 'success':
        config.panelClass = ['success-snackbar'];
        break;
      case 'error':
        config.panelClass = ['error-snackbar'];
        break;
      case 'warning':
        config.panelClass = ['warning-snackbar'];
        break;
      case 'info':
        config.panelClass = ['info-snackbar'];
        break;
    }
  }
}
