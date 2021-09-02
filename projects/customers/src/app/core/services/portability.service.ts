import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Maxlines,
  MaxlinesResponse,
  OmissionPin,
  OmissionPinResponse,
  PortabilityParam,
  PortabilityParamResponse,
} from '../models';
import { ApiService } from './api.service';
import {
  DeclarationKnowledge,
  DeclarationKnowledgeResponse,
} from '@customers/app/core/models/declaration-knowledge.model';
import {
  GenerateDocument,
  GenerateDocumentResponse,
} from '@customers/app/core/models/generate-documents.models';
import { IParameter } from '@customers/app/core';
import {
  PortabilityRequest,
  PortabilityRequestResponse,
} from '@customers/app/core/models/portability-request.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PaymentPorta ,PaymentPortaResponse} from '@customers/app/core/models/payment-porta.model';
@Injectable({
  providedIn: 'root',
})
export class PortabilityService {
  declarations: DeclarationKnowledge[];
  constructor(private apiService: ApiService) {}

  private stateDataSubject = new BehaviorSubject<string>('');
  data$ = this.stateDataSubject.asObservable();

  sendSectNumber(secNumber: string) {
    this.stateDataSubject.next(secNumber);
  }

  getSectNumber() {
    return this.stateDataSubject.getValue();
  }

  getPortabilityParam(
    cboKey: string,
    params?: any,
  ): Promise<PortabilityParam[]> {
    return this.apiService
      .get(`${this.apiService.portabilityParams}/${cboKey}`, params)
      .pipe(
        map(response =>
          response.map(
            (param: PortabilityParamResponse) => new PortabilityParam(param),
          ),
        ),
        map((response: PortabilityParam[]) => {
          return response.filter(
            element =>
              cboKey !== 'CBO_OPERATOR' ||
              (cboKey === 'CBO_OPERATOR' && element.value !== '32'),
          );
        }),
      )
      .toPromise();
  }

  postPortabilityValidate(body: any): Promise<{ success: boolean }> {
    return this.apiService
      .post(this.apiService.portabilityValidate, body)
      .toPromise();
  }

  postOmissionPin(body: any): Promise<OmissionPin> {
    return this.apiService
      .post(this.apiService.omissionPin, body)
      .pipe(map((omission: OmissionPinResponse) => new OmissionPin(omission)))
      .toPromise();
  }

  registerPriorConsultation(body: any): Promise<{ secuentailCode: string }> {
    return this.apiService
      .post(this.apiService.registerConsult, body)
      .toPromise();
  }

  getPriorConsultation(
    body: any,
  ): Promise<{
    activationDate: string;
    saleOptions: IParameter[];
    dueFlag: boolean;
    reasonDescription: string;
  }> {
    return this.apiService
      .post(this.apiService.previewConsult, body)
      .pipe(
        map(response => {
          response = response[0];
          response.saleOptions = response.saleTypeAllowed.map(option => ({
            value: option.optionCode,
            label: option.optionDescription,
          }));
          return response;
        }),
      )
      .toPromise();
  }

  getDocumentDeclare(idService: string): Promise<DeclarationKnowledge[]> {
    if (this.declarations) {
      return Promise.resolve(this.declarations);
    } else {
      return this.apiService
        .get(`${this.apiService.documentDeclare}/${idService}`)
        .pipe(
          map(response => {
            this.declarations = response.map(
              (declaration: DeclarationKnowledgeResponse) =>
                new DeclarationKnowledge(declaration),
            );
            return this.declarations;
          }),
        )
        .toPromise();
    }
  }

  generateSec(body: any): Promise<{ secNumber: string }> {
    return this.apiService.post(this.apiService.generateSec, body).toPromise();
  }

  saveSales(
    body: any,
  ): Promise<{
    orderNumber: string;
    orderMessage: string;
    orderNumberSynergi: string;
  }> {
    return this.apiService.post(this.apiService.saveSales, body).toPromise();
  }

  postGenerateDocuments(body: any): Promise<GenerateDocumentResponse[]> {
    return this.apiService
      .post(this.apiService.generateDocuments, body)
      .pipe(
        map(response => {
          return response.map(
            (document: GenerateDocumentResponse) =>
              new GenerateDocument(document),
          );
        }),
      )
      .toPromise();
  }

  getPaymentTicketTypes(): Observable<IParameter[]> {
    return this.apiService.get(this.apiService.documentPayments).pipe(
      map(res =>
        res.map(
          paymentDocType =>
            ({
              value: paymentDocType.paymentDocument,
              label: paymentDocType.paymentDocumentDescription,
            } as IParameter),
        ),
      ),
    );
  }

  postExecutePaymentPorta(
    body: any,
  ): Promise<{ success: string; date: string }> {
    return this.apiService
      .post(this.apiService.executePaymentPorta, body)
      .toPromise();
  }

  postExecutePaymentPorta2(body: any): Promise<PaymentPorta> {
    return this.apiService
      .post(this.apiService.executePaymentPorta, body)
      .pipe(map((paymentPortaResponse: PaymentPortaResponse) => new PaymentPorta(paymentPortaResponse)))
      .toPromise();
  }

  postExecutePaymentAlta(
    body: any,
  ): Promise<{ success: string; phoneNumber: string }> {
    return this.apiService
      .post(this.apiService.executePaymentAlta, body)
      .toPromise();
  }

  postPaymentRollback(body: any): Promise<{ success: string }> {
    return this.apiService
      .post(this.apiService.paymentRollback, body)
      .toPromise();
  }

  postPortabilityRequest(body: any): Promise<PortabilityRequest> {
    return this.apiService
      .post(this.apiService.portabilityRequest, body)
      .pipe(
        map((resp: PortabilityRequestResponse) => new PortabilityRequest(resp)),
      )
      .toPromise();
  }

  getMaxlines(body: any): Promise<Maxlines> {
    return this.apiService
      .post(this.apiService.maxlines, body)
      .pipe(map((maxlines: MaxlinesResponse) => new Maxlines(maxlines)))
      .toPromise();
  }
}
