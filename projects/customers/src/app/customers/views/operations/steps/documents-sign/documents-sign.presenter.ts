import { Injectable } from '@angular/core';

import { IParameter } from '@customers/app/core';

@Injectable()
export class DocumentsSignPresenter {
  options: IParameter[];
  digitalSignature: string;

  getOptionsCard(enableDigital = true) {
    this.options = [];
    if (enableDigital) {
      this.digitalSignature = 'digital-signature';
      this.options.push(
        {
          icon: 'digital-signature',
          label: null,
          value: this.digitalSignature,
          checked: true,
        });
    }
    this.options.push(
      {
        icon: 'manual-signature',
        label: null,
        value: 'manual-signature',
        checked: !enableDigital,
      },
    );
  }
}
