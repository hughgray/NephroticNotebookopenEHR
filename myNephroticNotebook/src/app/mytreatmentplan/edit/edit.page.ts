import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { FetchReadingService } from '../../services/fetch-reading.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ActionSheetController } from '@ionic/angular'
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';


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
  treatmentplan = [];
  treatmentPlanEHR: any;
  remissionDurIso: string;
  now: string;
  treatmentPlanCdr = [];
  docName: string;
  ehrId: string;
  uid: string;
  moreRemission: [];

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

  constructor(public alertController: AlertController, private storage: Storage, public api:ApiService, public actionSheetController: ActionSheetController, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService, public fetchReading:FetchReadingService) {

    this.treatmentPlanForm = this.formBuilder.group({
      doctorsName: new FormControl('',Validators.compose([
        Validators.required
      ])),
      maintenanceDose: new FormControl('',Validators.compose([
        Validators.required
      ])),
      maintenanceTimes: new FormControl('',Validators.compose([
        Validators.required
      ])),
      maintenanceInterval: new FormControl('',Validators.compose([
        Validators.required
      ])),

      relapseAmount: new FormControl('',Validators.compose([
        Validators.required
      ])),
      relapseTimes: new FormControl('',Validators.compose([
        Validators.required
      ])),
      relapseInterval: new FormControl('',Validators.compose([
        Validators.required
      ])),

      remissionAmount: new FormControl('',Validators.compose([
        Validators.required
      ])),
      remissionDuration: new FormControl('',Validators.compose([
        Validators.required
      ])),
      remissionTimes: new FormControl('',Validators.compose([
        Validators.required
      ])),
      remissionInterval: new FormControl('',Validators.compose([
        Validators.required
      ])),

      moreRemissionAmount: new FormArray([]),
      moreRemissionDuration: new FormArray([]),
      moreRemissionTimes: new FormArray([]),
      moreRemissionInterval: new FormArray([])
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

    this.fetchReading.myProfileDetails()
    .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.docName 	= String(data[0].doc);
            this.ehrId 	= String(data[0].ehrid);
            
         }  			
      });

    this.storage.set("Connection", 0);
    console.log('Connection set to 0')

  }
  

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What state are you currently in?',
      buttons: [{
        text: 'Maintenance',
        handler: () => {
          console.log('Maintenance selected');
          this.currentState = 1;
          this.treatmentplan1()
        }
      }, {
        text: 'Relapse',
        handler: () => {
          console.log('Relapse selected');
          this.currentState = 2;
          this.treatmentplan1()
        }
      }, {
        text: 'Remission',
        handler: () => {
          console.log('Remission selected');
          this.currentState = 3;
          this.treatmentplan1()
        }
      }]
    });
    await actionSheet.present();
  }

  treatmentplan1(){
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

    console.log("Amount ", this.treatmentPlanForm.value.moreRemissionAmount)
    console.log("Duration ", this.treatmentPlanForm.value.moreRemissionDuration)
    console.log("Times ", this.treatmentPlanForm.value.moreRemissionTimes)
    console.log("Interval ", this.treatmentPlanForm.value.moreRemissionInterval)

    console.log("Amount ", Amount)
    console.log("Duration ", Duration)
    console.log("Times ", Times)
    console.log("Interval ", Interval)

    var treatmentplan = [maintenance, relapse, remission];

    for (var i = 0; i < Amount.length; i++){ 
      treatmentplan.push(window['remission' + i] = ["remission" +i, Duration[i], Amount[i], Times[i], Interval[i]]);
      this.treatmentPlanCdr.push(window['remission' + i] = ["remission" +i, Duration[i], Amount[i], Times[i], Interval[i]]);
    };

    console.log('Maintenance Dose: ', this.treatmentPlanForm.value.maintenanceDose);
    console.log('Maintenance Duration: ', this.maintenanceDuration);
    console.log('Maintenance Times: ', this.treatmentPlanForm.value.maintenanceTimes);
    console.log('Maintenance Interval: ', this.treatmentPlanForm.value.maintenanceInterval);
    console.log('Relapse Amount: ', this.treatmentPlanForm.value.relapseAmount);
    console.log('Relapse Duration: ', this.relapseDuration);
    console.log('Relapse Times: ', this.treatmentPlanForm.value.relapseTimes);
    console.log('Relapse Interval: ', this.treatmentPlanForm.value.relapseInterval);
    console.log('Remission Amount: ', this.treatmentPlanForm.value.remissionAmount);
    console.log('Remission Duration: ', this.treatmentPlanForm.value.remissionDuration);
    console.log('Remission Times: ', this.treatmentPlanForm.value.remissionTimes);
    console.log('Remission Interval: ', this.treatmentPlanForm.value.remissionInterval);
    console.log('More Remission Amount: ', this.treatmentPlanForm.value.moreRemissionAmount);
    console.log('More Remission Duration: ', this.treatmentPlanForm.value.moreRemissionDuration);
    console.log('More Remission Times: ', this.treatmentPlanForm.value.moreRemissionTimes);
    console.log('More Remission Interval: ', this.treatmentPlanForm.value.moreRemissionInterval);
    console.log('Maintenance: ',maintenance);
    console.log('Relapse: ',relapse);
    console.log('Remission',remission);
    console.log('TreatmentPlan Array: ',treatmentplan);
    console.log('TreatmentPlan Array: ',treatmentplan[0][1]); 
    console.log('Current State: ',this.currentState);
    console.log('TreatmentPlan Array: ',treatmentplan);
    console.log('TreatmentPlan Array: ',treatmentplan[3][1]);


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

    if (this.ehrId){
      console.log('adding... to CDR')
      this.dailyReadingPrep()
    }
    else {
      console.log('No consent- just local storage')
      this.router.navigateByUrl('/tabs/tab3');
    }

  }

  goBack(){
    this.router.navigateByUrl('tabs/tab3/mytreatmentplan');
   }

   dailyReadingPrep(): Promise<any>{
    return new Promise(resolve => {

    this.remissionDurIso = "P" + this.treatmentPlanForm.value.remissionDuration + "D"
    this.now = moment().format('YYYY-MM-DD hh:mm:ss')
         
    this.prepTreatmentPlan()		  			
    });

  }

  checkConsent(){

    this.storage.get("EHR")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 1){
          console.log('ehrID exists so they consent')
          this.api.getTemplates()
            .then( () => {
              return this.checkConnection()
            })
        }
        else {
        console.log('No consent- just local storage')
        this.presentActionSheet()
    }
  })
  }

  prepTreatmentPlan(): Promise<any>{
    return new Promise(resolve => {  

    console.log('time:', this.now)
    console.log('name:', this.docName)
    console.log('ehrid:', this.ehrId)


    this.treatmentPlanEHR = {
      "ctx/language": "en",
      "ctx/territory": "GB",
      "ctx/composer_name": this.treatmentPlanForm.value.doctorsName,
      "ctx/id_namespace": "HOSPITAL-NS",
      "ctx/id_scheme": "HOSPITAL-NS",
      "ctx/health_care_facility|name": "Hospital",
      "ctx/health_care_facility|id": "9091",
      "nephrotic_syndrome_treatment_plan/care_team/name": "Nephrotic syndrome team",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/role": "Lead clinician",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value": "12345f",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|issuer": "GMC",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|assigner": "GMC",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|type": "GMCnumber",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/use|code": "at0002",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/text": "Text 98",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/system|code": "at0014",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/value": "Value 76",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/medication_item": "Prednisolone",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/clinical_indication:0": "Nephrotic syndrome Maintenance",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/direction_sequence": 1,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/direction_duration": "P999999D",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/dosage/dose_amount|magnitude": this.treatmentPlanForm.value.maintenanceDose,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": this.treatmentPlanForm.value.maintenanceTimes,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:0/repetition_timing/interval": "P"+this.treatmentPlanForm.value.maintenanceInterval+"D",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/clinical_indication:1": "Nephrotic syndrome Relapse",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/direction_sequence": 2,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/direction_duration": "P999999D",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/dosage/dose_amount|magnitude": this.treatmentPlanForm.value.relapseAmount,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/dosage/dose_amount|unit": "1",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/dosage/dose_unit|code": "mg",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/dosage/dose_unit|value": "mg",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/dosage/daily_timing/frequency|magnitude": this.treatmentPlanForm.value.relapseTimes,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/dosage/daily_timing/frequency|unit": "1/d",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/dosage/dose_unit|terminology": "UCUM",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:1/repetition_timing/interval": "P"+this.treatmentPlanForm.value.relapseInterval+"D",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/clinical_indication:2": "Nephrotic syndrome Remission",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/direction_sequence": 3,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/direction_duration": this.remissionDurIso,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/dosage/dose_amount|magnitude": this.treatmentPlanForm.value.remissionAmount,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/dosage/dose_amount|unit": "1",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/dosage/dose_unit|code": "mg",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/dosage/dose_unit|value": "mg",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/dosage/daily_timing/frequency|magnitude": this.treatmentPlanForm.value.remissionTimes,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/dosage/daily_timing/frequency|unit": "1/d",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/dosage/dose_unit|terminology": "UCUM",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:2/repetition_timing/interval": "P"+this.treatmentPlanForm.value.remissionInterval+"D",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/order/timing": this.now,
      "nephrotic_syndrome_treatment_plan/maintenance_plan/expiry_time": "2099-01-01T00:00:00.00Z",
      "nephrotic_syndrome_treatment_plan/maintenance_plan/narrative": "Human readable instruction narrative"
  }

  for (var i = 3; i < this.treatmentPlanCdr.length+3; i++){ 

    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/clinical_indication:"+i] = "Nephrotic syndrome Remission";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/direction_sequence"] = i+1;
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/direction_duration"] = "P"+this.treatmentPlanCdr[i-3][2]+"D";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/dosage/dose_amount|magnitude"] = this.treatmentPlanCdr[i-3][2];
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/dosage/dose_amount|unit"] = "1";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/dosage/dose_unit|code"] = "mg";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/dosage/dose_unit|value"] = "mg";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/dosage/daily_timing/frequency|magnitude"] = this.treatmentPlanCdr[i-3][3];
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/dosage/daily_timing/frequency|unit"] = "1/d";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/dosage/dose_unit|terminology"] = "UCUM";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/maintenance_plan/order/therapeutic_direction:"+i+"/repetition_timing/interval"] = "P"+this.treatmentPlanCdr[i-3][4]+"D"

  };

    console.log('body:', JSON.stringify(this.treatmentPlanEHR))
    resolve()
    this.getPlanUid()

  })
  }

  getPlanUid(){
    this.fetchReading.treatmentDetails()
    .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.uid	= String(data[0].planUid);
         }
         console.log('Plan Uid: ', this.uid)
         this.sendTreatmentPlan()

      });
  }

  checkConnection(){

    this.storage.get("Connection")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 0){
          this.noNetworkConnection()
        }
        else{
          console.log("Connection is g! Did that work?");
          this.presentActionSheet()
        }
    });
  }

  async noNetworkConnection() {

    const alert = await this.alertController.create({
      header: 'CONNECTION ERROR',
      message: 'You must be able to connect to the CDR in order to change your Treatment Plan. Please check your internet connection and restart the app.',
    });
    await alert.present();
  }

  sendTreatmentPlan(){

    this.api.commitNewTreatmentPlan(this.uid, this.treatmentPlanEHR)
    .then(() => {
      console.log('New Plan Sent');
      this.router.navigateByUrl('/tabs/tab3');
    })

  }

}
