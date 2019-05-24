import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-post-reading',
  templateUrl: './post-reading.page.html',
  styleUrls: ['./post-reading.page.scss'],
})
export class PostReadingPage implements OnInit {
  todayStr: string;
  now: string;
  reading: number;
  readingSquareIcon: string;
  stateString: string;
  readingDesc: string;
  medTaken: number;
  comment: string;
  
  sub: any;

  treatmentDetails: any;
  dosesPerInterval: number;
  reccDose: number;
  stateName: string;
  intervalLen: number;

  new_state: number;
  new_start_date: string;
  active_state_id: number;

  orig_state: number;
  orig_start_date: string;

  constructor(private database: DatabaseService, private router: Router, private storage: Storage) { }

  ngOnInit() {
    this.now = moment().format('YYYY-MM-DD')+' 00:00:00';
    this.todayStr = this.getTodaysDateAsStr();
    this.getReadingInfo();
    this.getTreatmentDetails();
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  getTodaysDateAsStr() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth();
    let mmstr;

    switch (mm) {
      case mm = 0:
        mmstr = "Jan";
        break;
      case mm = 1:
        mmstr = "Feb";
        break;
      case mm = 2:
        mmstr = "Mar";
        break;
      case mm = 3:
        mmstr = "Apr";
        break;
      case mm = 4:
        mmstr = "May";
        break;
      case mm = 5:
        mmstr = "Jun";
        break;
      case mm = 6:
        mmstr = "Jul";
        break;
      case mm = 7:
        mmstr = "Aug";
        break;
      case mm = 8:
        mmstr = "Sep";
        break;
      case mm = 9:
        mmstr = "Oct";
        break;
      case mm = 10:
        mmstr = "Nov";
        break;
      case mm = 11:
        mmstr = "Dec";
    }

    let todaysDateAsStr = mmstr.toUpperCase() + ' ' + dd;
    return todaysDateAsStr;
  }

  displayMedsTaken() {
    document.getElementById("conConfirmMeds").style.display = "none";
    document.getElementById("conCancelMeds").style.display = "";
  }

  displayMedsNotTaken() {
    document.getElementById("conConfirmMeds").style.display = "";
    document.getElementById("conCancelMeds").style.display = "none";
  }

  confirmMedsTaken() {
    let query = "UPDATE daily_readings SET medication_taken = 1 WHERE date_of_reading = '" + this.now + "';";
    this.database.doQuery(query).then((data: any) => {
      console.log(query)
      this.displayMedsTaken();
      this.medTaken = 1;
    })
  }

  cancelMedsTaken() {
    let query = "UPDATE daily_readings SET medication_taken = 0 WHERE date_of_reading = '" + this.now + "';";
    this.database.doQuery(query).then((data: any) => {
      console.log(query)
      this.displayMedsNotTaken();
      this.medTaken = 0;
    })
  }

  getReadingInfo() {
    let query = "SELECT * FROM daily_readings WHERE date_of_reading = '" + this.now + "';";
    this.database.doQuery(query).then((data: any) => {
      console.log("postreading data = ");
      console.log(data);
      this.reading = data[1]["reading_level_id"];
      console.log("reading = " + this.reading);

      // get reading info
      if (this.reading == 1) {
        this.readingSquareIcon = "neg-sq";
        this.readingDesc = "Negative";
      }
      else if (this.reading == 2) {
        this.readingSquareIcon = "trace-sq";
        this.readingDesc = "Trace";
      }
      else if (this.reading == 3) {
        this.readingSquareIcon = "oneplus-sq";
        this.readingDesc = "30mg/dL";
      }
      else if (this.reading == 4) {
        this.readingSquareIcon = "twoplus-sq";
        this.readingDesc = "100mg/dL";
      }
      else if (this.reading == 5) {
        this.readingSquareIcon = "threeplus-sq";
        this.readingDesc = "300mg/dL";
      }
      else if (this.reading == 6) {
        this.readingSquareIcon = "fourplus-sq";
        this.readingDesc = "2000mg/dL +";
      }
      else {
        console.log(this.reading + "is not a number between 1 and 6");
      }
      console.log("readingSqIcon = " + this.readingSquareIcon);

      // get meds info
      this.medTaken = data[1]["medication_taken"];
      console.log("medstaken = " + this.medTaken);

      if (this.medTaken == 0) {
        this.displayMedsNotTaken();
        console.log('displayMeds0');
      } else if (this.medTaken == 1) {
        this.displayMedsTaken();
        console.log('displayMeds1');
      }

      // get comment
      this.comment = data[1]["user_comment"];
      console.log("user comment = " + this.comment);
      if (!this.comment) {
        this.comment = "None";
      }
    })
  }

  editReading() {
    let query = "DELETE FROM daily_readings WHERE date_of_reading = '" + this.now + "'";
    console.log(query);
    // let query = "DELETE FROM daily_readings WHERE date_of_reading = date('now')";
    this.database.doQuery(query)
      .then((data: any) => {
        this.storage.get("origStateObj")
      })  
      .then((val) => {
        console.log("val pulled from storage below:");
        console.log(val);
        this.orig_state = val["orig_state"];
        this.orig_start_date = val["orig_start_date"];
      })
      .then((data: any) => {
        this.database.updateActiveTreatmentState(this.orig_state, this.orig_start_date)
      })
      .then((data: any) => {
        this.router.navigate(['tabs/tab2/pre-reading']);
      })
  }

  getTreatmentDetails() {
    this.storage.get("new_state_obj")
      .then((val) => {
        console.log("val pulled from storage below:");
        console.log(val);
        this.new_state = val["new_state"];
        this.new_start_date = val["new_start_date"];
      })
    this.database.doQuery("SELECT * FROM active_treatment_state")
      .then((val1: any) => {
        console.log(val1);
        this.active_state_id = val1[1]["active_treatment_state_id"]
      })
      .then((val) => {
        let query = "SELECT * FROM treatment_state WHERE treatment_state_id = " + this.new_state
        console.log(query)
        this.database.doQuery(query).then((result: any) => {
          console.log(result);
          this.treatmentDetails = result[1];
        }).then((val) => {
          this.dosesPerInterval = this.treatmentDetails["doses_per_interval"];
          this.reccDose = this.treatmentDetails["recc_dose"];
          this.stateName = this.treatmentDetails["state_name"];
          this.intervalLen = this.treatmentDetails["interval_length"];
        })
      })
  }

}
