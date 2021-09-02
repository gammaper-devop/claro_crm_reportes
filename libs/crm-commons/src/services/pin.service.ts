import { Injectable } from '@angular/core';

import { CRMApiService } from './api.service';
import { Pin } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CRMPinService {
  constructor(private apiService: CRMApiService) {}

  sendPin(body: any): Promise<Pin> {
    return this.apiService.post(this.apiService.sendPin, body).toPromise();
  }

  validatePin(body: any): Promise<{}> {
    return this.apiService.post(this.apiService.validatePin, body).toPromise();
  }
}
