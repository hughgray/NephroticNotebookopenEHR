import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mytreatmentplan',
  templateUrl: './mytreatmentplan.page.html',
  styleUrls: ['./mytreatmentplan.page.scss'],
})
export class MytreatmentplanPage implements OnInit {

  treatmentForm: FormGroup;
  public treatmentPlan	  : any 	= null;
  public treatmentPlanId	  : any 	= null;
  public planId	  : any 	= null;
  public plan  	     : any 	= null;
  public isData 		     : boolean 		 = false;

  constructor(private router: Router, public formBuilder: FormBuilder, public fetchReading:FetchReadingService) { }

  public ngOnInit() : void
   {  	
      this.fetchReading
      .treatmentPlanID()
      .then((data) => 
      {
         this.planId = data;

         console.log("id from db come on 4", this.planId[0].planId);	 		  			
         this.planId = this.planId[0].planId;
         console.log("ID to be retrieved",this.planId)
         this.getCurrentPlan(this.planId)
      });
   } 


  public getCurrentPlan(id) : void
   {  	
      this.fetchReading
      .treatmentPlan(id)
      .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.treatmentPlan 	= data;
            this.isData = true;
         }
         console.log("plan 1", this.treatmentPlan)
         console.log("plan 2", this.treatmentPlan.amt)
         console.log("plan 3", this.treatmentPlan[0].amt)
         console.log("plan 4", this.treatmentPlan[1].dur)		  			
         this.populatePlan(this.treatmentPlan);

      });
   } 


   public makeArray(data : Array<any>) : void
   {
      let k;
      this.plan.length = 0;
      for(k in data)
      {
         this.plan.push(data[k].state, data[k].amt, data[k].dur, data[k].pillno, data[k].interval);	
      }
      console.log("plan from db", this.plan)
      console.log("plan from db", this.plan[0])
      console.log("plan from db", this.plan[1])
   }

   public populatePlan(data : Array<any>) : void {

      this.plan = data.splice(0, 2);
      console.log("plan from db", this.plan)
      console.log("plan from db", this.plan[0].amt)
      console.log("plan from db", this.plan[1].amt)
    }

   goBack(){
   this.router.navigateByUrl('tabs/tab3');
   }

   editPlan(){
    this.router.navigateByUrl('tabs/tab3/mytreatmentplan/edit');
   }



}

