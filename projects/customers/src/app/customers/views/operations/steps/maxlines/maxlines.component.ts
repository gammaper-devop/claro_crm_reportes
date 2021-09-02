import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-maxlines',
  templateUrl: './maxlines.component.html',
  styleUrls: ['./maxlines.component.scss'],
})
export class MaxlinesComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<MaxlinesComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
  ) {}

  ngOnInit() {}

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
