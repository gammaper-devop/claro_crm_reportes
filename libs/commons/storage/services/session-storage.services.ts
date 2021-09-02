import { Injectable } from '@angular/core';
import { BrowserStorageManager } from '@claro/core';

@Injectable()
export class SessionStorage extends BrowserStorageManager {}
