import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { DeclarationKnowledgePresenter } from './declaration-knowledge.presenter';

@Component({
  selector: 'app-declaration-knowledge',
  templateUrl: './declaration-knowledge.component.html',
  styleUrls: ['./declaration-knowledge.component.scss'],
  providers: [DeclarationKnowledgePresenter],
})
export class DeclarationKnowledgeComponent implements OnInit {
  isValidForm = false;

  constructor(
    private dialogRef: MatDialogRef<DeclarationKnowledgeComponent>,
    public presenter: DeclarationKnowledgePresenter,
  ) {}

  async ngOnInit() {
    await this.presenter.getDeclarationsKnowledge();
    this.isValidForm = this.validateValidForm();
  }

  resetForm() {
    this.presenter.declarationList.controls.map((control, i) => {
      if (!this.presenter.linesText[i].flagMandatory) {
        control.get('idValue').setValue(false);
      }
    });
    this.isValidForm = this.validateValidForm();
  }

  acceptAll() {
    this.presenter.declarationList.controls.map((control, i) => {
      control.get('idValue').setValue(true);
    });
    this.isValidForm = true;
  }

  validateValidForm() {
    return this.presenter.declarationList.controls.every(
      (control, i) => control.get('idValue').value,
    );
  }

  checkValue(event: any, i: any) {
    this.isValidForm = this.validateValidForm();
  }

  getValidChecks() {
    const response = [];
    this.presenter.declarationList.controls.forEach((control, i) => {
      if (control.get('idValue').value) {
        response.push({ idText: control.get('idText').value, active: true });
      }
    });
    return response;
  }

  submit(): void {
    if (this.validateValidForm()) {
      this.dialogRef.close(this.getValidChecks());
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
