import { Injectable } from '@angular/core';

import { Messages } from '@claro/crm/commons';
import { AuthService } from './core';

@Injectable()
export class AppSecurity {
  private interval: number;
  private isFirstLoad = true;
  constructor(private authService: AuthService) {}

  consoleSecurity(): void {
    console.log(
      '%c¡Detente!',
      'color: #da272c; font-size: 60px; font-weight: bold; text-shadow: 1px 1px 5px #000;',
    );
    console.log(
      '%c' + Messages.consoleSecurity,
      'color: #da272c; font-size: 20px; font-weight: bold;',
    );

    if ((window as any).chrome) {
      const element = new Image();
      Object.defineProperty(element, 'id', { get: this.refresh });
      console.log('%c', element);
    } else {
      this.interval = window.setInterval(this.detect, 1000);
      window.addEventListener('consoleChange', this.refresh);
    }
    window.setTimeout(() => (this.isFirstLoad = false), 1000);
  }

  private detect = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (
      (widthThreshold || heightThreshold) &&
      !(heightThreshold && widthThreshold)
    ) {
      window.clearInterval(this.interval);
      window.dispatchEvent(new CustomEvent('consoleChange'));
    }
  };

  private refresh = () => {
    window.setTimeout(
      () => {
        this.authService.logout();
        location.href = '/';
      },
      this.isFirstLoad ? 0 : 3000,
    );
  };
}
