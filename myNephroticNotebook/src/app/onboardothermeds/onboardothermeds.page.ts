import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-onboardothermeds',
  templateUrl: './onboardothermeds.page.html',
  styleUrls: ['./onboardothermeds.page.scss'],
})
export class OnboardothermedsPage implements OnInit {

  myMeds: string;
  myOtherMedDetails: any;

  constructor(private router: Router, private database:DatabaseService) { 

  }

  ngOnInit() {
  }

  openHome() {
    this.router.navigateByUrl('/tabs/tab3');
  }

  backToTreatmentPlan() {
    this.router.navigateByUrl('../onboardtrementplan');
  }

  addToDB() {
    this.myOtherMedDetails = {
      "other_meds": this.myMeds,
    }
    this.database.insertData(this.myOtherMedDetails, "profileOtherMeds");
    console.log('Other Meds: ', this.myMeds);
    this.router.navigateByUrl('/tabs/tab2');
  }

}
