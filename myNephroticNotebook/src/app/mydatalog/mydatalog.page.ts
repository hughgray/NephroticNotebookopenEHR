import { Component, OnInit } from '@angular/core';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mydatalog',
  templateUrl: './mydatalog.page.html',
  styleUrls: ['./mydatalog.page.scss'],
})
export class MydatalogPage implements OnInit {

  public data_log	  : any 	= null;

  constructor(private router: Router, public fetchReading:FetchReadingService) { }

   public ngOnInit() : void
   {  	
      this.fetchReading
      .dataLog()
      .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.data_log 	= data;
         }
         console.log("plan 1", this.data_log)
         console.log("plan 3", this.data_log[0].date)
         console.log("plan 4", this.data_log[0].meds_taken)
         console.log("plan 5", this.data_log[0].symbol)	
   			  			
      });
   } 

  exportDataLog() {
    this.router.navigateByUrl('/tabs/tab3/mydatalog/exportlog');
  }

  goBack(){
    this.router.navigateByUrl('tabs/tab3');
   }

}
