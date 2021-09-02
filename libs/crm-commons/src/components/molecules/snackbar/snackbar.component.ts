import { Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'crm-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  constructor(
    public snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public options: any,
  ) {}

  hide() {
    this.snackBar.dismiss();
  }
}
