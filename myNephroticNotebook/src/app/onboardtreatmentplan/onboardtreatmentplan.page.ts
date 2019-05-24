import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular'
import * as moment from 'moment';

@Component({
  selector: 'app-onboardtreatmentplan',
  templateUrl: './onboardtreatmentplan.page.html',
  styleUrls: ['./onboardtreatmentplan.page.scss'],
})
export class OnboardtreatmentplanPage implements OnInit {
 
  treatmentForm: FormGroup;
  maintenanceDuration = 99999999;
  relapseDuration = 99999999;
  myTreatmentDetails: any;
  currentState: any;

  error_messages = {
    'maintenanceDose': [
      { type: 'required', message: 'These are all required. Enter "0" if none.' }
    ]
  }

  constructor(public actionSheetController: ActionSheetController, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService) { 

    this.treatmentForm = this.formBuilder.group({
      maintenanceDose: new FormControl('',Validators.compose([
        Validators.required
      ])),
      maintenanceTimes: new FormControl(''),
      maintenanceInterval: new FormControl(''),

      relapseAmount: new FormControl('',Validators.compose([
        Validators.required
      ])),
      relapseTimes: new FormControl(''),
      relapseInterval: new FormControl(''),

      remissionAmount: new FormControl('',Validators.compose([
        Validators.required
      ])),
      remissionDuration: new FormControl(''),
      remissionTimes: new FormControl(''),
      remissionInterval: new FormControl(''),

      moreRemissionAmount: new FormArray([]),
      moreRemissionDuration: new FormArray([]),
      moreRemissionTimes: new FormArray([]),
      moreRemissionInterval: new FormArray([])
    });
  }

  addRemissionAmount(){
    (<FormArray>this.treatmentForm.get('moreRemissionAmount')).push(new FormControl(''));
  }

  removeRemissionAmount(index){
    (<FormArray>this.treatmentForm.get('moreRemissionAmount')).removeAt(index);
  }

  addRemissionDuration(){
    (<FormArray>this.treatmentForm.get('moreRemissionDuration')).push(new FormControl(''));
  }

  removeRemissionDuration(index){
    (<FormArray>this.treatmentForm.get('moreRemissionDuration')).removeAt(index);
  }

  addRemissionTimes(){
    (<FormArray>this.treatmentForm.get('moreRemissionTimes')).push(new FormControl(''));
  }

  removeRemissionTimes(index){
    (<FormArray>this.treatmentForm.get('moreRemissionTimes')).removeAt(index);
  }

  addRemissionInterval(){
    (<FormArray>this.treatmentForm.get('moreRemissionInterval')).push(new FormControl(''));
  }

  removeRemissionInterval(index){
    (<FormArray>this.treatmentForm.get('moreRemissionInterval')).removeAt(index);
  }


  ngOnInit() {

  }

  // backToDetails() {
  //   this.router.navigateByUrl('../onboard');
  // }

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
      this.treatmentForm.value.maintenanceDose, 
      this.treatmentForm.value.maintenanceTimes,
      this.treatmentForm.value.maintenanceInterval];

    var relapse = ["relapse",
      this.relapseDuration,
      this.treatmentForm.value.relapseAmount, 
      this.treatmentForm.value.relapseTimes,
      this.treatmentForm.value.relapseInterval];

    var remission = ["remission",
      this.treatmentForm.value.remissionDuration, 
      this.treatmentForm.value.remissionAmount,
      this.treatmentForm.value.relapseTimes,
      this.treatmentForm.value.relapseInterval];
    
    var Amount = this.treatmentForm.value.moreRemissionAmount;
    var Duration = this.treatmentForm.value.moreRemissionDuration;
    var Times = this.treatmentForm.value.moreRemissionTimes;
    var Interval = this.treatmentForm.value.moreRemissionInterval;

    var treatmentplan = [maintenance, relapse, remission];

    for (var i = 0; i < Amount.length; i++){ 
      treatmentplan.push(window['remission' + i] = ["remission" +i, Duration[i], Amount[i], Times[i], Interval[i]]);
    };


    console.log('Maintenance Dose: ', this.treatmentForm.value.maintenanceDose);
    console.log('Maintenance Duration: ', this.maintenanceDuration);
    console.log('Maintenance Times: ', this.treatmentForm.value.maintenanceTimes);
    console.log('Maintenance Interval: ', this.treatmentForm.value.maintenanceInterval);
    console.log('Relapse Amount: ', this.treatmentForm.value.relapseAmount);
    console.log('Relapse Duration: ', this.relapseDuration);
    console.log('Relapse Times: ', this.treatmentForm.value.relapseTimes);
    console.log('Relapse Interval: ', this.treatmentForm.value.relapseInterval);
    console.log('Remission Amount: ', this.treatmentForm.value.remissionAmount);
    console.log('Remission Duration: ', this.treatmentForm.value.remissionDuration);
    console.log('Remission Times: ', this.treatmentForm.value.remissionTimes);
    console.log('Remission Interval: ', this.treatmentForm.value.remissionInterval);
    console.log('More Remission Amount: ', this.treatmentForm.value.moreRemissionAmount);
    console.log('More Remission Duration: ', this.treatmentForm.value.moreRemissionDuration);
    console.log('More Remission Times: ', this.treatmentForm.value.moreRemissionTimes);
    console.log('More Remission Interval: ', this.treatmentForm.value.moreRemissionInterval);
    console.log('Maintenance: ',maintenance);
    console.log('Relapse: ',relapse);
    console.log('Remission',remission);
    console.log('TreatmentPlan Array: ',treatmentplan);
    console.log('TreatmentPlan Array: ',treatmentplan[0][1]); 
    console.log('Current State: ',this.currentState);



    for (var i = 0; i < treatmentplan.length; i++){

      var treatment = [];

      treatment = [1, 
        treatmentplan[i][0], 
        treatmentplan[i][1], 
        treatmentplan[i][2], 
        treatmentplan[i][3], 
        treatmentplan[i][4],
      ]
      this.database.insertData(treatment, "treatment_stateReal");
      console.log('Treatment: ',treatment);
    }

    var now = moment().format('YYYY-MM-DD')+' 00:00:00'
    console.log('Date: ',now);


    var activeState = [
      this.currentState,
      now
    ]
    this.database.insertData(activeState, "active_treatment_state");

    this.router.navigateByUrl('/onboardothermeds');

  }


}
