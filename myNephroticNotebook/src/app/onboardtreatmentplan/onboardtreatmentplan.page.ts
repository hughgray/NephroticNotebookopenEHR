import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular'
import * as moment from 'moment';
import { FetchReadingService } from '../services/fetch-reading.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

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
  treatmentPlanEHR: any;
  remissionDurIso: string;
  now: string;
  nowT: string;
  treatmentPlanCdr = [];
  docName: string;
  docNumber: string;
  ehrId: string;
  typeID: string;
  docID: string;
  moreRemission: [];

  error_messages = {
    'maintenanceDose': [
      { type: 'required', message: 'These are all required. Enter "0" if none.' }
    ]
  }

  constructor(private storage: Storage, public api:ApiService, public fetchReading:FetchReadingService, public actionSheetController: ActionSheetController, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService) { 

    this.treatmentForm = this.formBuilder.group({
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
      this.treatmentPlanCdr.push(window['remission' + i] = ["remission" +i, Duration[i], Amount[i], Times[i], Interval[i]]);
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

    this.checkConsent(); 	

  }

  dailyReadingPrep(): Promise<any>{
    return new Promise(resolve => {

    this.remissionDurIso = "P" + this.treatmentForm.value.remissionDuration + "D"
    this.now = moment().format('YYYY-MM-DD')+' 00:00:00'
    this.nowT = moment().format('YYYY-MM-DDThh:mm:ssZ')
    console.log('Time: ',this.nowT)

    this.fetchReading.myProfileDetails()
    .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.docName 	= String(data[0].doc);
            this.docNumber = String(data[0].num);
            this.docID = String(data[0].docId);
            this.typeID = String(data[0].idType);
            this.ehrId 	= String(data[0].ehrid);
         }
         
        this.prepTreatmentPlan()		  			
      });
    });

  }

  checkConsent(){

    this.storage.get("EHR")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 0){
          console.log('No consent- just local storage')
          this.router.navigateByUrl('/onboardothermeds');
        }
        else{
          console.log("ehrID exists so they consent");
          this.dailyReadingPrep()
        }
    });
  }

  prepTreatmentPlan(): Promise<any>{
    return new Promise(resolve => {

    console.log('time:', this.now)
    console.log('name:', this.docName)
    console.log('num:', this.docNumber)
    console.log('ID:', this.docID)
    console.log('ID type:', this.typeID)
    console.log('ehrid:', this.ehrId)


    this.treatmentPlanEHR = {
      "ctx/language": "en",
      "ctx/territory": "GB",
      "nephrotic_syndrome_treatment_plan/composer|id": this.docID,
      "nephrotic_syndrome_treatment_plan/composer|id_scheme": this.typeID,
      "nephrotic_syndrome_treatment_plan/composer|id_namespace": this.typeID + "Number",
      "nephrotic_syndrome_treatment_plan/composer|name": this.treatmentForm.value.doctorsName,
      "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id": "123456-123",
      "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id_scheme": "ETHERCIS-SCHEME",
      "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id_namespace": "DEMOGRAPHIC",
      "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|name": "FACILITY",
      "nephrotic_syndrome_treatment_plan/event_context/start_time": this.nowT,
      "nephrotic_syndrome_treatment_plan/event_context/setting|code": "238",
      "nephrotic_syndrome_treatment_plan/event_context/setting|value": "Other Care",
      "nephrotic_syndrome_treatment_plan/event_context/setting|terminology": "openehr",
      "nephrotic_syndrome_treatment_plan/care_team/name": "Nephrotic syndrome team",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/role": "Lead clinician",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value": this.docID,
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|issuer": this.typeID,
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|assigner": this.typeID,
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|type": this.typeID + "number",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/use|code": "at0002",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/text": this.docName,
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/system|code": "at0012",
      "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/value": this.docNumber,
      "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/current_state|code": "245",
      "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/careflow_step|code": "at0015",
      "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/careflow_step|value": "Informed Consent Provided",
      "nephrotic_syndrome_treatment_plan/informed_consent/consent_name": "Consent to Treatment plan and sharing information to EHR",
      "nephrotic_syndrome_treatment_plan/informed_consent/time": this.nowT,
      "nephrotic_syndrome_treatment_plan/language|code": "en",
      "nephrotic_syndrome_treatment_plan/language|terminology": "ISO_639-1",
      "nephrotic_syndrome_treatment_plan/territory|code": "GB",
      "nephrotic_syndrome_treatment_plan/territory|terminology": "ISO_3166-1",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|code": "52388000",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|value": "Product containing prednisolone",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|terminology": "SNOMED-CT",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/clinical_indication:0": "Nephrotic syndrome Maintenance",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/direction_sequence": 1,
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_amount|magnitude": this.treatmentForm.value.maintenanceDose,
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": this.treatmentForm.value.maintenanceTimes,
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/repetition_timing/interval": "P"+this.treatmentForm.value.maintenanceInterval+"D",
      "nephrotic_syndrome_treatment_plan/medication_order:0/order/timing": this.now,
      "nephrotic_syndrome_treatment_plan/medication_order:0/narrative": "Nephrotic syndrome Maintenance",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|code": "52388000",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|value": "Product containing prednisolone",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|terminology": "SNOMED-CT",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/clinical_indication:0": "Nephrotic syndrome Relapse",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/direction_sequence": 2,
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_amount|magnitude": this.treatmentForm.value.relapseAmount,
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": this.treatmentForm.value.relapseTimes,
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/repetition_timing/interval": "P"+this.treatmentForm.value.relapseInterval+"D",
      "nephrotic_syndrome_treatment_plan/medication_order:1/order/timing": this.now,
      "nephrotic_syndrome_treatment_plan/medication_order:1/narrative": "Nephrotic syndrome Relpase",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|code": "52388000",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|value": "Product containing prednisolone",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|terminology": "SNOMED-CT",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/clinical_indication:0": "Nephrotic syndrome Remission",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/direction_sequence": 3,
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/direction_duration": this.remissionDurIso,
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_amount|magnitude": this.treatmentForm.value.remissionAmount,
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": this.treatmentForm.value.remissionTimes,
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/repetition_timing/interval": "P"+this.treatmentForm.value.remissionInterval+"D",
      "nephrotic_syndrome_treatment_plan/medication_order:2/order/timing": this.now,
      "nephrotic_syndrome_treatment_plan/medication_order:2/narrative": "Human readable instruction narrative"
  }

  for (var i = 3; i < this.treatmentPlanCdr.length+3; i++){ 

    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/clinical_indication:"+(i-2)] = "Nephrotic syndrome Remission";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/direction_sequence"] = i+1;
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/direction_duration"] = "P"+this.treatmentPlanCdr[i-3][1]+"D";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/dosage/dose_amount|magnitude"] = this.treatmentPlanCdr[i-3][2];
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/dosage/dose_amount|unit"] = "1";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/dosage/dose_unit|code"] = "mg";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/dosage/dose_unit|value"] = "mg";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/dosage/daily_timing/frequency|magnitude"] = this.treatmentPlanCdr[i-3][3];
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/dosage/daily_timing/frequency|unit"] = "1/d";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/dosage/dose_unit|terminology"] = "UCUM";
    this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:"+(i-2)+"/repetition_timing/interval"] = "P"+this.treatmentPlanCdr[i-3][4]+"D"

  };

    console.log('body:', JSON.stringify(this.treatmentPlanEHR))
    resolve()
    this.sendTreatmentPlan()

  })
  }

  sendTreatmentPlan(){

    this.api.commitTreatmentPlan(this.ehrId, this.docName, this.treatmentPlanEHR)
    .then(() => {
      this.storage.get("CDR")
      .then((val) => {
        if (val != "Gosh"){
          this.api.deleteSession()
          .then(()=>{
            this.router.navigateByUrl('/onboardothermeds');
          })
        } else {
          this.router.navigateByUrl('/onboardothermeds');
        }
      })
    })
  }
}
