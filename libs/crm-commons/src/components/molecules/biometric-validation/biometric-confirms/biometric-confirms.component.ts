import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'crm-biometric-confirms',
  templateUrl: './biometric-confirms.component.html',
  styleUrls: ['./biometric-confirms.component.scss']
})
export class BiometricConfirmsComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<BiometricConfirmsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string;
      title: string;
      aggree: string;
      disagree: string;
      cancel: boolean;
    },
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close(false);
  }
  submit() {
    this.dialogRef.close(true);
  }

}
