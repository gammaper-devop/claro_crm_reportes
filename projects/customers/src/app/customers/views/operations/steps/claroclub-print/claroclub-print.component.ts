import { Component, OnInit } from '@angular/core';
import { LocalStorage, SessionStorage } from '@claro/commons/storage';
import { environment } from '@shell/environments/environment';

@Component({
  selector: 'app-change-points',
  templateUrl: './claroclub-print.component.html',
  styleUrls: ['./claroclub-print.component.scss'],
})
export class ClaroclubPrintComponent implements OnInit {
  cdn = environment.cdn;
  claroclub: any;

  constructor(private local: LocalStorage) {}

  ngOnInit() {
    this.claroclub = this.local.get('claroclub-print');
  }

  print() {
    window.print();
  }
}
