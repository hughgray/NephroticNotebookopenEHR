
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';




@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss']
})
export class Tab3Page implements OnInit {


  constructor(private router: Router,private database:DatabaseService,public platform:Platform) { }

  ngOnInit(){
    
  }

  openMyDetails() {
    this.router.navigateByUrl('/tabs/tab3/mydetails');
  }

  openMyDataLog() {
    this.router.navigateByUrl('/tabs/tab3/mydatalog');
  }

  openMyTreatmentPlan() {
    this.router.navigateByUrl('/tabs/tab3/mytreatmentplan');
  }
}
