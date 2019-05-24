import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { FetchReadingService } from '../../services/fetch-reading.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ActionSheetController } from '@ionic/angular'


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  treatmentPlanForm: FormGroup;
  maintenanceDuration = 99999999;
  relapseDuration = 99999999;
  myTreatmentDetails: any;
  planId: any; 	
  stateId: any;
  newPlanId: any;
  currentState: any;

  error_messages = {
    'doctorsName': [
      { type: 'required', message: 'You must enter your Doctor\'s name to update.' }
    ],
    'maintenanceDose': [
      { type: 'required', message: 'These are all required. Enter "0" if none.' }
    ],
    'relapseAmount': [
      { type: 'required', message: 'These are all required. Enter "0" if none.' }
    ],
    'remissionAmount': [
      { type: 'required', message: 'These are all required. Enter "0" if none.' }
    ]
  }

  constructor(public actionSheetController: ActionSheetController, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService, public fetchReading:FetchReadingService) {

      this.treatmentPlanForm = formBuilder.group({
      
      doctorsName: new FormControl('',Validators.compose([Validators.required])),

      maintenanceDose: new FormControl('',Validators.compose([Validators.required])),
      maintenanceTimes: new FormControl(''),
      maintenanceInterval: new FormControl(''),

      relapseAmount: new FormControl('',Validators.compose([Validators.required])),
      relapseTimes: new FormControl(''),
      relapseInterval: new FormControl(''),

      remissionAmount: new FormControl('',Validators.compose([Validators.required])),
      remissionDuration: new FormControl(''),
      remissionTimes: new FormControl(''),
      remissionInterval: new FormControl(''),

      moreRemissionAmount: new FormArray([]),
      moreRemissionDuration: new FormArray([]),
      moreRemissionTimes: new FormArray([]),
      moreRemissionInterval: new FormArray([])
    });

  }

  public ngOnInit() : void {

    this.fetchReading
      .treatmentPlanID()
      .then((data) => 
      {
         this.planId = data;

         console.log("id from db come on 4", this.planId[0].planId);	 		  			
         this.planId = ((this.planId[0].planId)+1);
         this.newPlanId = this.planId
         console.log("single #",this.planId)
      });

    this.fetchReading
    .activeTreatmentPlanID()
    .then((data) => 
    {
        this.stateId = data;

        console.log("id from db come on 4", this.stateId[0].activeStateId);	 		  			
        this.stateId = this.stateId[0].activeStateId
    });

  }
  
  addRemissionAmount(){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionAmount')).push(new FormControl(''));
  }

  removeRemissionAmount(index){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionAmount')).removeAt(index);
  }

  addRemissionDuration(){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionDuration')).push(new FormControl(''));
  }

  removeRemissionDuration(index){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionDuration')).removeAt(index);
  }

  addRemissionTimes(){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionTimes')).push(new FormControl(''));
  }

  removeRemissionTimes(index){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionTimes')).removeAt(index);
  }

  addRemissionInterval(){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionInterval')).push(new FormControl(''));
  }

  removeRemissionInterval(index){
    (<FormArray>this.treatmentPlanForm.get('moreRemissionInterval')).removeAt(index);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What state are you currently in?',
      buttons: [{
        text: 'Maintenance',
        handler: () => {
          console.log('Maintenance selected');
          this.currentState = 1;
          this.treatmentplan()
        }
      }, {
        text: 'Relapse',
        handler: () => {
          console.log('Relapse selected');
          this.currentState = 2;
          this.treatmentplan()
        }
      }, {
        text: 'Remission',
        handler: () => {
          console.log('Remission selected');
          this.currentState = 3;
          this.treatmentplan()
        }
      }]
    });
    await actionSheet.present();
  }

  treatmentplan(){
    var maintenance = ["maintenance",
      this.maintenanceDuration,
      this.treatmentPlanForm.value.maintenanceDose, 
      this.treatmentPlanForm.value.maintenanceTimes,
      this.treatmentPlanForm.value.maintenanceInterval];

    var relapse = ["relapse",
      this.relapseDuration,
      this.treatmentPlanForm.value.relapseAmount, 
      this.treatmentPlanForm.value.relapseTimes,
      this.treatmentPlanForm.value.relapseInterval];

    var remission = ["remission",
      this.treatmentPlanForm.value.remissionDuration, 
      this.treatmentPlanForm.value.remissionAmount,
      this.treatmentPlanForm.value.relapseTimes,
      this.treatmentPlanForm.value.relapseInterval];
    
    var Amount = this.treatmentPlanForm.value.moreRemissionAmount;
    var Duration = this.treatmentPlanForm.value.moreRemissionDuration;
    var Times = this.treatmentPlanForm.value.moreRemissionTimes;
    var Interval = this.treatmentPlanForm.value.moreRemissionInterval;

    var treatmentplan = [maintenance, relapse, remission];

    for (var i = 0; i < Amount.length; i++){ 
      treatmentplan.push(window['remission' + i] = ["remission" +i, Duration[i], Amount[i], Times[i], Interval[i]]);
    };

    console.log('Maintenance: ',maintenance);
    console.log('Relapse: ',relapse);
    console.log('Remission',remission);
    console.log('TreatmentPlan Array: ',treatmentplan);
    console.log('TreatmentPlan Array: ',treatmentplan[0][1]);


    for (var i = 0; i < treatmentplan.length; i++){

      var treatment = [];

      treatment = [
        this.newPlanId, 
        treatmentplan[i][0], 
        treatmentplan[i][1], 
        treatmentplan[i][2], 
        treatmentplan[i][3], 
        treatmentplan[i][4],
      ]

      this.database.insertData(treatment, "treatment_stateReal");
      console.log('Treatment: ',treatment);
      console.log("single #",this.newPlanId)

    }

    var myDoc = {
      "doctor_name": this.treatmentPlanForm.value.doctorsName,
    }
    this.database.insertData(myDoc, "profileDoc");

    var now = moment().format('YYYY-MM-DD')+' 00:00:00'
    console.log('Date: ',now);

    var newActiveState = this.stateId + this.currentState;
    console.log('State New: ',newActiveState);

    this.database.updateActiveTreatmentState(newActiveState, now);

    this.router.navigateByUrl('/tabs/tab3');

  }

  goBack(){
    this.router.navigateByUrl('tabs/tab3/mytreatmentplan');
   }

}
