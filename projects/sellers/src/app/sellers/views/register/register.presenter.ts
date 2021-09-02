import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  Biometric,
  BiometricConfig,
  CRMBiometricService,
  CRMGenericsService,
  DocumentType,
  ErrorResponse,
  CRMErrorService,
} from '@claro/crm/commons';
import { catchError } from 'rxjs/operators';
import { SellersService, Seller, SellerResponse } from '@sellers/app/core';
import { IParameter } from '@contracts/app/core';
import { AuthService, User } from '@shell/app/core';
import { EOperationType } from '../../../core/enums/operation-type.enum';

@Injectable()
export class RegisterPresenter {
  documentTypes$: Observable<DocumentType[]>;
  accounts: IParameter[];
  error: ErrorResponse;
  showPageError: boolean;
  errorSale: ErrorResponse;
  isScanning: boolean;
  biometric: Biometric;
  biometricConfig: BiometricConfig;
  successfulBiometric: boolean;
  noMoreAttempts: boolean;
  user: User;
  errorPhone: string;
  seller: Seller;
  errorPostPut: string;

  constructor(
    private genericsService: CRMGenericsService,
    private sellersService: SellersService,
    private biometricService: CRMBiometricService,
    private authService: AuthService,
    private errorService: CRMErrorService,
  ) {
    this.user = this.authService.getUser();
    this.listDocumentsTypes();
  }

  listDocumentsTypes() {
    this.documentTypes$ = this.genericsService.getUserDocuments('PAG_CLI').pipe(
      catchError(error => {
        this.error = this.errorService.showError(error, 'CRM-902');
        this.showPageError = true;
        return throwError(error);
      }),
    );
  }

  async getCboSellers() {
    try {
      return await this.sellersService.getPortabilityParam(
        'CBO_SELLERS_STATUS',
      );
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-2004');
      this.showPageError = true;
    }
  }

  async getBiometricConfig(officeSaleCode: string) {
    this.error = null;
    try {
      const response = await this.biometricService.getBestFingerprint({
        officeSaleCode,
        processCode: 'VEN01',
        operationType: EOperationType.EMP,
        productType: '01',
        orderNumber: '',
      });
      this.biometricConfig = response.configuration;
      return !!this.biometricConfig.biometricFlag;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-943');
      return false;
    }
  }

  async getnetworkAccount() {
    const body = {
      profilesAllowed: this.user.seller.profilesAllowed,
      officeCode: this.user.office,
    };
    try {
      this.accounts = await this.sellersService
        .getnetworkAccountTypes(body)
        .toPromise();
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-2002', true);
      this.showPageError = true;
      return throwError(error);
    }
  }

  async getValidatePhone(value: any): Promise<boolean> {
    this.error = null;
    const body = {
      phoneNumber: value.phoneNumber,
      documentType: value.documentType,
      documentNumber: value.documentNumber,
    };
    try {
      await this.sellersService.getValidatePhone(body);
      return true;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-2003');
      this.showPageError = true;
      this.errorPhone = this.error.description;
      return false;
    }
  }

  async postRegisterSellers(value: any): Promise<boolean> {
    this.error = null;
    try {
      await this.sellersService.postRegisterSellers(value);
      return true;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-2005');
      this.showPageError = true;
      this.errorPostPut = error.description;
      return false;
    }
  }

  async putRegisterSellers(value: any): Promise<boolean> {
    this.error = null;
    try {
      await this.sellersService.putRegisterSellers(value);
      return true;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-2006');
      this.showPageError = true;
      this.errorPostPut = error.description;
      return false;
    }
  }

  async submitBiometric(body: any): Promise<Seller> {
    this.error = null;
    try {
      const sellerResponse = await this.biometricService.validateFingerprint(
        body,
      );
      this.successfulBiometric = true;
      return new Seller(sellerResponse as SellerResponse);
    } catch (error) {
      this.successfulBiometric = false;
      this.error = this.errorService.showError(error, 'CRM-908');
      this.showPageError = true;
      return null;
    }
  }

  showSaleError() {
    this.errorSale = {
      code: '',
      title: 'Error al grabar la venta.',
      description:
        (this.error && this.error.description) ||
        'Lo sentimos, no hemos podido grabar la venta correctamente',
      errorType: this.error.errorType,
    };
  }
}
