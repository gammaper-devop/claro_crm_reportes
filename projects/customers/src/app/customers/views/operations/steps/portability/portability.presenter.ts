import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

import {
  ErrorResponse,
  CRMGenericsService,
  Office,
  CRMErrorService,
} from '@claro/crm/commons';
import { User } from '@shell/app/core';
import {
  Customer,
  Line,
  Maxlines,
  OmissionPin,
  PortabilityService,
} from '@customers/app/core';

@Injectable()
export class PortabilityPresenter {
  office: Office;
  error: ErrorResponse;
  validateMaxlines: any;
  maxLines: any;
  omissionResp: OmissionPin;

  constructor(
    private portabilityService: PortabilityService,
    public genericsService: CRMGenericsService,
    private errorService: CRMErrorService,
  ) {
    this.office = this.genericsService.getOfficeDetail();
  }

  async getMaxlines(
    user: User,
    customer: Customer,
    saleOperationType: string,
  ): Promise<Maxlines> {
    this.error = null;
    const body = {
      typeSale: '02',
      operationType: saleOperationType,
      documentType: customer.documentTypeCode,
      documentNumber: customer.documentNumber,
      channelCode: user.channel,
      userAccount: user.account,
    };
    try {
      this.maxLines = await this.portabilityService.getMaxlines(body);
      return await this.portabilityService.getMaxlines(body);
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-942');
      return null;
    }
  }

  async portabilityValidate(
    user: User,
    customer: Customer,
    saleOperationType: string,
    lines: FormArray,
  ): Promise<boolean> {
    const phones = lines.controls.map(line => ({
      phoneNumber: line.value.phoneNumber,
    }));
    this.error = null;
    const body = {
      typeSale: '02',
      operationType: saleOperationType,
      documentType: customer.documentTypeCode,
      documentNumber: customer.documentNumber,
      channelCode: user.channel,
      validationType: '1',
      userAccount: user.account,
      phoneNumberList: phones,
    };
    try {
      await this.portabilityService.postPortabilityValidate(body);
      return true;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-954');
      return false;
    }
  }

  async getCausesForOmmission(
    user: User,
    lines: FormArray,
  ): Promise<OmissionPin> {
    this.error = null;
    const body = {
      officeSalecode: this.office.officeCode,
      portabilityType: lines.controls[0].value.cboService?.value,
      channel: user.channel,
      typeDocument: user.documentType,
    };
    try {
      this.omissionResp = await this.portabilityService.postOmissionPin(body);
      return this.omissionResp;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-003');
      return error;
    }
  }

  linesSec(lines: FormArray) {
    return lines.controls.map((line, index) => {
      return {
        phone: line.value.phoneNumber,
        modalityCode: line.value.cboModOrigin.value,
        modalityDescription: line.value.cboModOrigin.label,
        order: index + 1,
        sequentialCode: line.value.sequentialCode,
      };
    });
  }

  async generateSec(
    user: User,
    customer: Customer,
    lines: FormArray,
    declarations: any[],
    omitted: any,
    numbersForOmission: string[],
    supervisorAccount: string,
  ): Promise<any> {
    this.error = null;
    const priorConsultationConfig = user.configurations.find(
      config => config.key === 'priorConsultation',
    );
    const body = {
      documentType: customer.documentTypeCode,
      documentNumber: customer.documentNumber,
      name: customer.name,
      firstName: customer.firstName,
      secondName: customer.secondName,
      nationalityCode: customer.nationalityCode,
      nationalityDescription: customer.nationalityDescription,
      serviceCode: lines.controls[0].value.cboService.value,
      operatorCode: lines.controls[0].value.cboOperator.value,
      checkList: declarations,
      phoneNumbers: this.linesSec(lines),
      phoneContact: customer.phoneNumber,
      officeSale: this.office.officeCode,
      channelCode: user.channelDescription,
      userAccount: user.account,
      phoneCodeType: lines.controls[0].value.cboService.value,
      planCodeType: '',
      descSaleDescripcion: this.office.officeDescription,
      productType: lines.controls[0].value.cboService.value,
      flagCPDisable: priorConsultationConfig?.value === '1' ? '0' : '1',
      saleOption: '1',
      supervisorAccount: supervisorAccount || '',
      omitted: omitted || '',
      node: '227',
      phoneNumbersOmitted: numbersForOmission,
    };
    try {
      const response = await this.portabilityService.generateSec(body);
      return response.secNumber || false;
    } catch (error) {
      this.error = this.errorService.showError(error, 'CRM-956');
      return false;
    }
  }

  getLines(lines: FormArray): Line[] {
    return lines.controls.map((line, index) => {
      const {
        cboService,
        cboOperator,
        cboModOrigin,
        phoneNumber,
        saleOptions,
        sequentialCode,
      } = line.value;
      return new Line({
        order: index + 1,
        service: cboService,
        operator: cboOperator,
        modalityFrom: cboModOrigin,
        phone: phoneNumber,
        saleOptions,
        sequentialCode,
      } as Line);
    });
  }
}
