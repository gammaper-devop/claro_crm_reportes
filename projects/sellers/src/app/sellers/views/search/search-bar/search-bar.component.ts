import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EInputValidation } from '@claro/commons';
import { MemoryStorage } from '@claro/commons/storage';
import { ECriteriaType, Seller } from '@sellers/app/core';
import { ESellerDocument } from '@sellers/app/core';
import { SearchBarPresenter } from './search-bar.presenter';
import { MessageBus } from '@claro/commons/message-bus';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [SearchBarPresenter],
})
export class SearchBarComponent implements OnInit {
  @Output() listSellersEmit = new EventEmitter();
  @Output() ngModelChange = new EventEmitter();
  inputValue: string;
  listSellers: Seller[];
  form: FormGroup;
  selectValue = '';
  type: string;
  maxLength: number;
  inputType: EInputValidation;
  valueDocument: any;

  constructor(
    private fb: FormBuilder,
    private memory: MemoryStorage,
    public presenter: SearchBarPresenter,
    private messageBus: MessageBus,
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      documentType: [null],
      documentValue: ['', Validators.required],
    });

    this.valueDocument = this.memory.get('searchValues');
    if (this.valueDocument?.criteriaId === ECriteriaType.DOCUMENT) {
      this.selectValue = this.valueDocument.documentTypeId;
      this.form.get('documentType').setValue(this.selectValue);
      this.form.get('documentValue').setValue(this.valueDocument.searchText);
      this.form.updateValueAndValidity();
    }

    await this.presenter.getDocuments();
    if (this.presenter.options) {
      this.form.get('documentType').setValue(this.presenter.options[0].value);
      this.changeDocType(this.presenter.options[0].value);
    }
  }

  @HostListener('input', ['$event']) onInputChange($event) {
    this.inputValue = $event.target.value.toUpperCase();
    this.ngModelChange.emit(this.inputValue);
  }

  get getDocumentValue() {
    return this.form.get('documentValue');
  }

  get getDocumentType() {
    return this.form.get('documentType');
  }

  changeDocType(documentType: string) {
    this.type = documentType;
    this.getDocumentValue.setValue('');
    this.getDocumentValue.clearValidators();
    switch (documentType) {
      case ESellerDocument.DNI:
        this.maxLength = 8;
        this.inputType = EInputValidation.Number;
        this.getDocumentValue.setValidators([
          Validators.required,
          Validators.pattern('[0-9]{8,8}'),
        ]);
        break;
      case ESellerDocument.NAC:
        this.maxLength = 7;
        this.inputType = EInputValidation.Alphanumeric;
        this.getDocumentValue.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]{5,12}'),
        ]);
        break;
      case ESellerDocument.ICD:
        this.maxLength = 12;
        this.inputType = EInputValidation.Alphanumeric;
        this.getDocumentValue.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]{5,12}'),
        ]);
        break;
      case ESellerDocument.PAS:
        this.maxLength = 12;
        this.inputType = EInputValidation.Alphanumeric;
        this.getDocumentValue.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]{5,12}'),
        ]);
        break;
      case ESellerDocument.CPP:
        this.maxLength = 12;
        this.inputType = EInputValidation.Alphanumeric;
        this.getDocumentValue.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]{5,12}'),
        ]);
        break;
      default:
        this.maxLength = 15;
        this.inputType = EInputValidation.Alphanumeric;
        this.getDocumentValue.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]{5,15}'),
        ]);
    }
    this.getDocumentValue.markAsUntouched();
    this.getDocumentValue.updateValueAndValidity();
  }

  async onSubmit() {
    const response = await this.presenter.postSellers(
      this.getDocumentType.value,
      this.getDocumentValue.value,
    );
    const optionSelected = this.presenter.options.find(
      element => element.value === this.getDocumentType.value,
    );
    this.messageBus.emit(
      'optionSelectedChannel',
      'optionSelected',
      optionSelected.criteriaId,
    );
    if (optionSelected.criteriaId === '2') {
      this.listSellers = response.filter(
        resp => resp.account === this.form.value.documentValue.toUpperCase(),
      );
    } else {
      this.listSellers = response.filter(
        resp =>
          resp.documentNumber === this.form.value.documentValue.toUpperCase() ||
          resp.account === this.form.value.documentValue.toUpperCase(),
      );
    }

    this.listSellersEmit.emit({
      list: this.listSellers,
      type: this.getDocumentType.value,
    });
  }
}
