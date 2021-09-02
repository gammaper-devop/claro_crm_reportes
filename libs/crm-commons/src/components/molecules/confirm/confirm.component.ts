import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Confirms } from '../../../global';

interface Confirm {
  title: string;
  submit: string;
  icon: string;
}

@Component({
  selector: 'crm-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  confirm: Confirm;

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {
    this.confirm = Confirms[this.data];
  }

  submit(): void {
    this.dialogRef.close(this.data);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  close(): void {
    this.dialogRef.close();
  }
}
