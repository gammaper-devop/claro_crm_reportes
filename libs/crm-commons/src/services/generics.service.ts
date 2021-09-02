import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStorage } from '@claro/commons/storage';
import { MicroAppConfigService } from '../microapp-loader';
import {
  DocumentType,
  DocumentTypeResponse,
  Generics,
  GenericsResponse,
  Office,
  OfficeResponse,
} from '../models';
import { CRMApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CRMGenericsService {
  generics: {};

  constructor(
    private storage: LocalStorage,
    private config: MicroAppConfigService,
    private apiService: CRMApiService,
  ) {}

  getUserDocuments(
    pageCode: 'PAG_LOG' | 'PAG_CLI',
  ): Observable<DocumentType[]> {
    this.generics = this.storage.get(this.config.stateGenerics);
    const key = 'documents-' + pageCode;
    if (this.generics && this.generics[key]) {
      return of(this.generics[key]);
    } else {
      return this.apiService
        .get(this.apiService.getUserDocuments, { pageCode })
        .pipe(
          map(response =>
            response.documents.map(
              (documentType: DocumentTypeResponse) =>
                new DocumentType(documentType),
            ),
          ),
          map(documents => {
            this.setState(key, documents);
            return documents;
          }),
        );
    }
  }

  getGenerics(cboKey: string): Observable<Generics[]> {
    this.generics = this.storage.get(this.config.stateGenerics);
    const key = 'generics-' + cboKey;
    if (this.generics && this.generics[key]) {
      return of(this.generics[key]);
    } else {
      return this.apiService.get(`${this.apiService.generics}/${cboKey}`).pipe(
        map(response =>
          response.map((generic: GenericsResponse) => new Generics(generic)),
        ),
        map(generics => {
          this.setState(key, generics);
          return generics;
        }),
      );
    }
  }

  getOfficeDetail(officeCode?: Office): Office;
  getOfficeDetail(officeCode: string): Promise<Office>;
  getOfficeDetail(officeCode?: string | Office): Office | Promise<Office> {
    this.generics = this.storage.get(this.config.stateGenerics);
    const key = 'office';
    if (this.generics && this.generics[key] && !officeCode) {
      return this.generics[key];
    } else {
      if (typeof officeCode !== 'string') {
        this.setState(key, officeCode);
        return officeCode;
      } else {
        return this.apiService
        .get(this.apiService.officeDetails, { officeCode })
        .pipe(
          map((officeResponse: OfficeResponse) => {
            const office = new Office(officeResponse);
            this.setState(key, office);
            return office;
          }),
        )
        .toPromise();
      }
    }
  }

  private setState(key: string, data: any) {
    this.generics = this.storage.get(this.config.stateGenerics) || {};
    this.generics[key] = data;
    this.storage.set(this.config.stateGenerics, this.generics);
  }
}
