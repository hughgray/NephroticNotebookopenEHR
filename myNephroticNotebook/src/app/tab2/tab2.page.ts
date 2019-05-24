import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  now: string;
  queryResult: any;
  isTodaysReadingCompleted: boolean;

  constructor(private database: DatabaseService, private router: Router,public platform:Platform) { }

  ngOnInit() {
    this.now = moment().format('YYYY-MM-DD')+' 00:00:00';
    this.loadPage();
  }

  loadPage(){
    let query = "SELECT * FROM daily_readings WHERE date_of_reading = '" + this.now + "';";
    this.database.doQuery(query)
      .then((result: any) => {
        console.log('tab2Page print: ');
        console.log(result);
        this.queryResult = result;

        if (this.isEmpty(this.queryResult)) {
          this.isTodaysReadingCompleted = false;
        }
        else {
          this.isTodaysReadingCompleted = true;
        }

        if (this.isTodaysReadingCompleted) {
          console.log('already read today');
          this.router.navigate(['tabs/tab2/post-reading']);
        }
        else {
          console.log('not yet read today');
          this.router.navigate(['tabs/tab2/pre-reading']);
        }
      })
      .catch((error: any) => {
        console.log('tab2 error');
      })
  }

  ionViewWillEnter() {
    this.loadPage();
  }

  // this function checks if an object is empty
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}
