import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { OperationResponse, OperationType } from '../models/operation.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  constructor(private apiService: ApiService) {}

  getOperations(body: any): Promise<OperationType> {
    return this.apiService
      .get(this.apiService.operations, body)
      .pipe(map((operation: OperationResponse) => new OperationType(operation)))
      .toPromise();
  }
}
