import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-operations-reports',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {

  company:string = 'company';

  constructor(private router: Router) { }

  ngOnInit() {
    
  }

  onSellerReport(){
    this.router.navigate(['/reportes/distribuidores']);
  }
}
