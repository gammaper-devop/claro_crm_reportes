import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  IParameter,
} from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatchOptionsService {
  constructor(private apiService: ApiService) {}

  getDispatchOptions(): Observable<IParameter[]> {
    return this.apiService.get(this.apiService.dispatchOptions).pipe(
      map(res =>
        res.map(
          dispatchOptions =>
            ({
              value: dispatchOptions.code,
              label: dispatchOptions.description,
            } as IParameter),
        ),
      ),
    );
  }

}
