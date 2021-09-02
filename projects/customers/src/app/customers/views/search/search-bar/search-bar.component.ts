import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { EInputValidation } from '@claro/commons';
import { Criteria, ECriteriaType } from '@customers/app/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnChanges {
  @Input() options: Criteria[];
  @Output() search = new EventEmitter();
  @Output() searchChanged = new EventEmitter();
  placeholder = 'Ingresa el DNI';
  maxLength = '8';
  inputType: EInputValidation;
  searchCustomerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchCustomerForm = this.fb.group({
      criteriaId: [null, Validators.required],
      searchText: [null, Validators.required],
    });
  }

  ngOnChanges() {
    if (this.options && this.options.length) {
      this.searchCustomerForm.get('criteriaId').setValue(this.options[0]);
      this.onValueChanged(this.options[0]);
    }
  }

  onValueChanged(criteria: Criteria) {
    console.log("onValueChanged.....");
    console.log(criteria);
    this.searchCustomerForm.get('searchText').setValue('');
    this.placeholder = 'Ingresa el ' + criteria.label;
    if (criteria.value === ECriteriaType.DOCUMENT) {
      switch (criteria.documentTypeId) {
        case ECriteriaType.DNI:
          this.updateControl('searchText', 8, 8);
          this.inputType = EInputValidation.Number;
          break;
        case ECriteriaType.CIP:
          this.updateControl('searchText', 10, 10);
          this.inputType = EInputValidation.Alphanumeric;
          break;
        case ECriteriaType.CPP:
        case ECriteriaType.PASAPORTE:
        case ECriteriaType.CE:
          this.updateControl('searchText', 5, 12);
          this.inputType = EInputValidation.Alphanumeric;
          break;
          case ECriteriaType.RUC:
          this.updateControl('searchText',11, 11);
          this.inputType = EInputValidation.Alphanumeric;
          break;
      }
    } else if (criteria.value === ECriteriaType.PHONE) {
      this.updateControl('searchText', 9, 9);
      this.inputType = EInputValidation.Number;
    }

    this.searchChanged.emit();
  }

  onSearchTextChange(event: string) {
    this.searchCustomerForm.get('searchText').setValue(event);
    if (!this.searchCustomerForm.valid) {
      this.searchChanged.emit();
    }
  }

  updateControl(controlName: string, minLength: number, maxLength: number) {
    this.searchCustomerForm.get(controlName).setValue('');
    this.searchCustomerForm.get(controlName).clearValidators();
    this.searchCustomerForm
      .get(controlName)
      .setValidators(
        Validators.compose([
          Validators.required,
          Validators.minLength(minLength),
          Validators.maxLength(maxLength),
        ]),
      );
    this.searchCustomerForm.get(controlName).markAsUntouched();
    this.searchCustomerForm.get(controlName).updateValueAndValidity();
    this.maxLength = maxLength.toString();
  }

  onSubmit() {
    const { valid, value } = this.searchCustomerForm;
    const { criteriaId } = value;
    let { searchText } = value;

    if (this.searchCustomerForm.valid) {
      searchText = searchText.toUpperCase();
      const body = {
        searchText,
        criteriaId: criteriaId.value,
        documentTypeId: criteriaId.documentTypeId,
      };
      this.search.emit(body);
    }
  }
}
