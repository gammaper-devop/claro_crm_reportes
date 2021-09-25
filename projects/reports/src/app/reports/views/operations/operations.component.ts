import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CRMReportsService } from '@reports/app/core';

@Component({
  selector: 'app-operations-reports',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {

  company:string = 'company';

  constructor(private router: Router, private reportsService: CRMReportsService) { }

  ngOnInit() {
    console.log("ngOnInit() OperationsComponent");
    this.reportsService.removeInitRoute();
  }

  onSellerReport(){
    this.router.navigate(['/reportes/distribuidores']);
  }
}
