import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ClaroPoints, ClaroPointsResponse } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ClaroPointsService {
  constructor(private apiService: ApiService) {}

  postPoints(body: any): Promise<ClaroPoints> {
    return this.apiService
      .post(this.apiService.points, body)
      .pipe(map((pointsResponse: ClaroPointsResponse) => new ClaroPoints(pointsResponse)))
      .toPromise();
  }
}
