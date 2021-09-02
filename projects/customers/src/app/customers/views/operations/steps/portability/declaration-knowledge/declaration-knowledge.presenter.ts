import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CRMErrorService, ErrorResponse } from '@claro/crm/commons';
import { PortabilityService } from '@customers/app/core';
import { DeclarationKnowledge } from '@customers/app/core/models/declaration-knowledge.model';

@Injectable()
export class DeclarationKnowledgePresenter {
  error: ErrorResponse;
  linesText: DeclarationKnowledge[];
  options: DeclarationKnowledge[];
  form: FormGroup;

  constructor(
    private portabilityService: PortabilityService,
    private fb: FormBuilder,
    private errorService: CRMErrorService,
  ) {
    this.createForm();
  }

  async getDocumentDeclare() {
    this.error = null;
    try {
      this.linesText = await this.portabilityService.getDocumentDeclare(
        'prepago',
      );
    } catch (error) {
      this.error = this.errorService.showError(
        error,
        'CRM-955',
      );
      return false;
    }
  }

  async getDeclarationsKnowledge() {
    await this.getDocumentDeclare();
    const formArray = this.declarationList;
    this.options = this.linesText.map((declaration, i) => {
      formArray.push(this.createDeclarationForm());
      this.declarationList
        .at(i)
        .get('idValue')
        .setValue(true);
      this.declarationList
        .at(i)
        .get('idText')
        .setValue(declaration.value);
      if (declaration.flagMandatory) {
        this.declarationList
          .at(i)
          .get('idValue')
          .setValidators(Validators.requiredTrue);
      }

      return {
        value: declaration.value,
        label: declaration.label,
        orderNumber: declaration.orderNumber,
        flagMandatory: declaration.flagMandatory,
      } as DeclarationKnowledge;
    });
  }

  createForm() {
    this.form = this.fb.group({
      declarationList: this.fb.array([]),
    });
  }

  createDeclarationForm() {
    return this.fb.group({
      idValue: [''],
      idText: [''],
    });
  }

  get declarationList(): FormArray {
    return this.form.get('declarationList') as FormArray;
  }
}
