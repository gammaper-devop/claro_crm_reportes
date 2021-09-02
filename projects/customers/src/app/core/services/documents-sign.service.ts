import { Injectable } from '@angular/core';
import { ApiService } from '@customers/app/core';
import { map } from 'rxjs/operators';
import { TradeAgreementsResponse, TradeAgreementsType } from '@customers/app/core/models/documents-sign.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentsSignService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getTradeAgreements(body: any): Promise<TradeAgreementsResponse[]> {
    return this.apiService.get(this.apiService.documentsSign, body)
      .pipe(
        map(response => {
          return response.map(
            (tradeAgreement: TradeAgreementsResponse) =>
              new TradeAgreementsType(tradeAgreement)
          );
        })
      )
      .toPromise();
  }

  downloadPDF(url): any {

    return this.http.get(url, { responseType: 'blob'}).pipe(
      map(
        (res: any) => {
          if (res) {
            return new Blob([res], { type: 'application/pdf', });
          }
        }
      )
    );
  }
}
