import { Component, OnInit } from '@angular/core';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mydetails',
  templateUrl: './mydetails.page.html',
  styleUrls: ['./mydetails.page.scss'],
})
export class MydetailsPage implements OnInit {

  public myDetails	  : any 	= null; 
  public details  	  : Array<any>	    = [];
  public myBirthday	  : any 	= null; 

  constructor(private router: Router, public fetchReading:FetchReadingService) { 

  }


  public ngOnInit() : void
   {  	
      this.fetchReading
      .myProfileDetails()
      .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.myDetails 	= data;
         }
         console.log("my details from db", this.myDetails)	  			  			
         this.makeArray(this.myDetails);

         var dateonly = this.myDetails[0].birthday.split("T")[0] 
         this.myBirthday = {date: dateonly};
         console.log("my details", this.myDetails)
         console.log("my birthday", this.myBirthday)
         console.log("birthday other", this.myBirthday.date)
      });
   } 

   public makeArray(data : Array<any>) : void
   {
      let k;
      this.details.length = 0;
      for(k in data)
      {
         this.details.push(data[k].name, data[k].doc, data[k].num, data[k].birthday, data[k].othermeds);	
      }
      console.log("plan from db", this.details)
      console.log("plan from db", this.details[0])
      console.log("plan from db", this.details[1])
   }

   goBack(){
    this.router.navigateByUrl('tabs/tab3');
   }

   editDetails() {
      this.router.navigateByUrl('/tabs/tab3/mydetails/editdetails');
    }

}
