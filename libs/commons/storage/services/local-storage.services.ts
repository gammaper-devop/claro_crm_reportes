import { Injectable } from '@angular/core';
import { BrowserStorageManager } from '@claro/core';

@Injectable()
export class LocalStorage extends BrowserStorageManager {}
