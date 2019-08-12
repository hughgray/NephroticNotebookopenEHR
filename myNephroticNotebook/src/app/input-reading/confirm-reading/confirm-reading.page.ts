import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { FetchReadingService } from '../../services/fetch-reading.service';

@Component({
  selector: 'app-confirm-reading',
  templateUrl: './confirm-reading.page.html',
  styleUrls: ['./confirm-reading.page.scss'],
})
export class ConfirmReadingPage implements OnInit { 
  private sub: any;
  public user_comment: string;
  reading: string;

  todaysReadingObj: any;
  proteinReading: string;
  proteinSymb: string;
  proteinColorClass: string;
  readingLevel: number;
  treatment: any;
  readingLevelStr: string;
  commentStr: string;
  medTaken: number;
  active_treatment_state_id: number;
  active_treatment_state: any;
  new_state: string;
  new_start_date: string;
  treatmentDetails: string;
  dosesPerInterval: number;
  reccDose: number;
  stateName: string;
  intervalLen: number;
  now: string;
  protein: string;
  level: string;
  regime: string;
  status_code: string;
  myName: string;
  ehrId: string;
  dailyReading: any;
  dailyDose: number;
  state_code:object={'Maintenance':'at0002','Remission':"at0003",'Relapse':'at0004'};
  protein_code:object={1:'at0096',2:"at0097",3:'at0098',4:'at0099',5:"at0100",6:'at0101'};
  protein_level:object={1:'Negative',2:"Trace",3:'1+',4:'2+',5:"3+",6:'4+'};



  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService,
    private router: Router,
    private storage: Storage,
    public fetchReading:FetchReadingService,
    public api:ApiService
  ) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.reading = params['reading'];
    });

    this.medTaken = 0;
    this.getNextStateDetails();

    // select correct reading
    switch (this.reading) {
      case "neg": {
        this.proteinReading = "Negative";
        this.proteinSymb = "neg.svg";
        this.proteinColorClass = "protein-neg";
        this.readingLevel = 1;
        break;
      }
      case "trace": {
        this.proteinReading = "Trace";
        this.proteinSymb = "trace.svg";
        this.proteinColorClass = "protein-trace";
        this.readingLevel = 2;
        break;
      }
      case "onep": {
        this.proteinReading = "30mg/dL";
        this.proteinSymb = "oneplus.svg";
        this.proteinColorClass = "protein-one";
        this.readingLevel = 3;
        break;
      }
      case "twop": {
        this.proteinReading = "100mg/dL";
        this.proteinSymb = "twoplus.svg";
        this.proteinColorClass = "protein-two";
        this.readingLevel = 4;
        break;
      }
      case "threep": {
        this.proteinReading = "300mg/dL";
        this.proteinSymb = "threeplus.svg";
        this.proteinColorClass = "protein-three";
        this.readingLevel = 5;
        break;
      }
      case "fourp": {
        this.proteinReading = "2000mg/dL+";
        this.proteinSymb = "fourplus.svg";
        this.proteinColorClass = "protein-four";
        this.readingLevel = 6;
        break;
      }
      
    }

  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  getMedicationNumber(medTaken) {
    if (medTaken) {
      return 1;
    }
    else {
      return 0;
    }
  }

  addReadingToDB() {
    // get readingLevel
    this.readingLevelStr = document.getElementById("readingLevel").getAttribute("value");
    console.log(this.readingLevelStr);

    // get comment
    // this.commentStr = document.getElementById("comment").getAttribute("value");
    this.commentStr = this.user_comment;
    
    if (this.commentStr == null || this.commentStr =="") {
      this.commentStr = "None";
    }
    console.log('comment = ' + this.user_comment);

    this.todaysReadingObj = {
      "reading_level_id": this.readingLevel,
      "medication_taken": this.medTaken,
      "user_comment": this.commentStr,
      "treatment_state_id": this.new_state,
    }

    this.database.insertData(this.todaysReadingObj, "daily_readingsReal")
      .then((data: any) => {
        this.updateNewState();
      })
      .catch((error: any) => {
        console.log(error);
        console.log(error.stringify())
      })

  }

  confirmMedsTaken() {
    document.getElementById("confirmMeds").style.display = "none";
    document.getElementById("cancelMeds").style.display = "";

    this.medTaken = 1;

    console.log('confirmMedsTaken = ')
    console.log(this.medTaken)
  }

  cancelMedsTaken() {
    document.getElementById("confirmMeds").style.display = "";
    document.getElementById("cancelMeds").style.display = "none";

    this.medTaken = 0;

    console.log('confirmMedsTaken = ')
    console.log(this.medTaken)
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getNextStateDetails() {
    this.storage.get("new_state_obj")
      .then((val) => {
        console.log("val pulled from storage below:");
        console.log(val);
        this.new_state = val["new_state"];
        this.new_start_date = val["new_start_date"];
      })
      .then((val) => {
        let query = "SELECT * FROM treatment_state WHERE treatment_state_id = " + this.new_state + ";";
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
      .then((val) => {
        this.storage.set("treatmentDetails", this.treatmentDetails);
      })
  }

  updateNewState() {
    this.database.updateActiveTreatmentState(this.new_state, this.new_start_date)
      .then((data: any) => {
        console.log("Updating Active State with " + this.new_state + " and " + this.new_start_date);
      })
      .catch((error: any) => {
        console.log(error.stringify())
      })
      this.dailyReadingPrep();
  }

  goBack() {
    this.router.navigateByUrl('tabs/tab2/input-reading');
  }

  dailyReadingPrep(): Promise<any>{
    return new Promise(resolve => {

    this.now = moment().format('YYYY-MM-DDTHH:mm:ss')
    this.fetchReading.myProfileDetails()
    .then((data) => 
      {
         let existingData      = Object.keys(data).length;
         if(existingData !== 0)
         {
            this.myName 	= String(data[0].name);
            this.ehrId = String(data[0].ehrid);
         }
         
        this.stateName = this.stateName.charAt(0).toUpperCase() + this.stateName.slice(1)
        console.log("my details from db", this.myName)
        console.log("my details from db2", this.ehrId)
        this.regime = String(this.stateName) + ' regime'
        this.status_code = this.state_code[this.stateName]
        this.protein = this.protein_code[this.readingLevel]
        this.level = this.protein_level[this.readingLevel]
        this.dailyDose = (this.reccDose*this.dosesPerInterval)/this.intervalLen
        this.checkConsent(); 			  			
      });
    });

  }

  checkConsent(){

    this.storage.get("EHR")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 0){
          console.log('No consent- just local storage')
          this.router.navigate(['tabs/tab2/post-reading']);
        }
        else{
          console.log('ehrID exists so they consent')
          this.sendDailyReading()
        }
    });

  }

  sendDailyReading(): Promise<any>{
    return new Promise(resolve => {

    console.log('time:', this.now)
    console.log('name:', this.myName)
    console.log('ehrid:', this.ehrId)
    console.log('protein code:', this.protein)
    console.log('protein level:', this.level)
    console.log('protein ordinal', this.readingLevel)
    console.log('status code:', this.status_code)
    console.log('status value:', this.stateName)
    console.log('reason:', this.regime)
    console.log('comment:', this.user_comment)
    console.log('dose mag:', this.reccDose)
    console.log('dose unit:', this.dosesPerInterval)


    this.dailyReading = {
    "ctx/language": "en",
    "ctx/territory": "GB",
    "ctx/time": this.now,
    "ctx/composer_name": this.myName, 
    "ctx/id_namespace": "NHS-APP",
    "ctx/id_scheme": "NHS-APP",
    "ctx/health_care_facility|name": "Home",
    "ctx/health_care_facility|id": "000",
    "nephrotic_syndrome_self_monitoring/urinalysis/protein|code": this.protein,
    "nephrotic_syndrome_self_monitoring/urinalysis/protein|value": this.level,
    "nephrotic_syndrome_self_monitoring/urinalysis/protein|ordinal": this.readingLevel,
    "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|value": "Nephrotic syndrome",
    "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|code": "52254009",
    "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|terminology": "SNOMED-CT",
    "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/nephrotic_syndrome_status/status|code": this.status_code,
    "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/nephrotic_syndrome_status/status|value": this.stateName,
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/current_state|code": "245",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/current_state|value": "active",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/careflow_step|code": "at0006",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/careflow_step|value": "Dose administered",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|value": "Prednisolone",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|code": "52388000",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|terminology": "SNOMED-CT",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/reason": this.regime,
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/comment": this.user_comment,
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_amount|magnitude": this.dailyDose,
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_amount|unit": "1",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|code": "mg",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|value": "mg",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|terminology": "UCUM",
    "nephrotic_syndrome_self_monitoring/daily_dose_administered/time": this.now 
    }

    console.log('body:', this.dailyReading)
    this.checkConnection()
  })
  }

  checkConnection(){

    console.log("Checking Connection flag....");
    this.api.setCDRVariables()
    .then(()=>{
      this.api.getTemplates()
        .then( () => {
          return this.continueCheck()
      })
    })
  }

  continueCheck(){

    this.storage.get("Connection")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 1){
          this.api.commitComposition(this.ehrId, this.myName, this.dailyReading)
          .then(()=>{
            this.finalPlay()
          })
        }
        else{
          console.log("did that work?");
          this.api.storeReading(this.dailyReading)
          .then(()=>{
            this.finalPlay()
          })
        
        }
    });
  }

  finalPlay(){

    this.storage.get("CDR")
      .then((val) => {
        if (val != "Gosh"){
          //this.api.deleteSession()
          //.then(()=>{
            this.router.navigate(['tabs/tab2/post-reading'])
          //})
        } else {
          this.router.navigate(['tabs/tab2/post-reading'])
        }
      })
  }

}
