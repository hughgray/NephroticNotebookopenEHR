import { Component} from '@angular/core';
import { DatePickerComponent} from '../date-picker-component/date-picker-component';
import { FetchReadingService} from '../services/fetch-reading.service';
import {DatabaseService} from '../services/database.service';
import {Platform} from '@ionic/angular';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


  constructor(private DatePicker:DatePickerComponent,
              public fetchReading: FetchReadingService,
              private database:DatabaseService,
              public platform: Platform) {}

  ionViewDidEnter(){

  }

  ionViewWillEnter()
  {
    this.platform.ready().then(()=>{
    this.database.callDatabase().then((data : any) =>{
        //reload the data from database
        this.DatePicker.showView="calendar";
        this.fetchReading.months_fetched.clear();
        this.DatePicker.createCalendarWeeks();
        this.DatePicker.scrollMonth(this.DatePicker.yearSelected,this.DatePicker.monthSelected,this.DatePicker.years);
    })
  })

     this.fetchReading.treatmentState();
  }
  
  
}
