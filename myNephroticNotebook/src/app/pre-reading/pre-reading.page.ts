import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-pre-reading',
  templateUrl: './pre-reading.page.html',
  styleUrls: ['./pre-reading.page.scss'],
})
export class PreReadingPage implements OnInit {

  today:any;
  dd:any;
  mm:any;
  mmstr:string;
  todayStr: string;

  origStateObj: any;
  orig_start_date: string;
  orig_state: number;

  constructor(
    private router: Router,
    private database: DatabaseService,
    private storage: Storage) {}

  goToInputReading() {
    this.router.navigateByUrl('tabs/tab2/input-reading');
  }

  saveDaysStartingState() {
    this.database.doQuery("SELECT * FROM active_treatment_state")
      .then((val1: any) => {
        console.log("saveDaysStartingState")
        console.log(val1);
        this.orig_state = val1[1]["active_treatment_state_id"]
        this.orig_start_date = val1[1]["date_started"]
        this.origStateObj = {
          "orig_state": this.orig_state,
          "orig_start_date": this.orig_start_date
        };
        console.log(this.origStateObj);
      })
      .then((val:any) =>  {
        this.storage.set("origStateObj", this.origStateObj)
      })
      .then(() => {
        console.log('Stored original state = in Ion-Storage')
        console.log(this.origStateObj)
      })
  }

  ngOnInit() {
    this.saveDaysStartingState();
    this.today = new Date();
    this.dd = this.today.getDate();
    this.mm = this.today.getMonth();

    switch (this.mm) {
      case this.mm = 0:
        this.mmstr = "Jan";
        break;
      case this.mm = 1:
        this.mmstr = "Feb";
        break;
      case this.mm = 2:
        this.mmstr = "Mar";
        break;
      case this.mm = 3:
        this.mmstr = "Apr";
        break;
      case this.mm = 4:
        this.mmstr = "May";
        break;
      case this.mm = 5:
        this.mmstr = "Jun";
        break;
      case this.mm = 6:
        this.mmstr = "Jul";
        break;
      case this.mm = 7:
        this.mmstr = "Aug";
        break;
      case this.mm = 8:
        this.mmstr = "Sep";
        break;
      case this.mm = 9:
        this.mmstr = "Oct";
        break;
      case this.mm = 10:
        this.mmstr = "Nov";
        break;
      case this.mm = 11:
        this.mmstr = "Dec";
    }

    this.todayStr = this.mmstr.toUpperCase() + ' ' + this.dd;

  }

}
