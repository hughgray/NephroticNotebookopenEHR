import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Storage } from '@ionic/storage';
// import { FetchReadingService } from '../../services/fetch-reading.service';

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


  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService,
    private router: Router,
    private storage: Storage,
    // private fetch: FetchReadingService,
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
        this.router.navigate(['tabs/tab2/post-reading']);
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
  }

  goBack() {
    this.router.navigateByUrl('tabs/tab2/input-reading');
  }

}
