import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-input-reading',
  templateUrl: './input-reading.page.html',
  styleUrls: ['./input-reading.page.scss'],
})
export class InputReadingPage implements OnInit {

  readingObj: any;
  readingLevel: number;
  new_state: number;
  new_start_date: string;
  confirmPageParams: any;
  reading: string;

  constructor(
    private router: Router,
    private database: DatabaseService,
    private storage: Storage,
  ) { }

  ngOnInit() {
    // clear storage
    this.storage.set("new_state", null);
    this.storage.set("new_start_date", null);

    
  }

  updateActiveStateToLast() {
    
  }

  goToConfirmReading(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var classAttr = target.attributes.class;
    this.reading = classAttr.nodeValue;

    // select correct reading
    switch (this.reading) {
      case "neg": {
        this.readingLevel = 1;
        break;
      }
      case "trace": {
        this.readingLevel = 2;
        break;
      }
      case "onep": {
        this.readingLevel = 3;
        break;
      }
      case "twop": {
        this.readingLevel = 4;
        break;
      }
      case "threep": {
        this.readingLevel = 5;
        break;
      }
      case "fourp": {
        this.readingLevel = 6;
        break;
      }
    }

    this.findActiveTreatmentStateAndNavigate(this.readingLevel);

  }

  // new_start_date:string="";
  findActiveTreatmentStateAndNavigate(reading) {
    var new_state = 0;
    var new_start_date: string = "";
    var yesterday = moment(new Date()).add(-1, 'days').format("YYYY-MM-DD");
    var twodaysago = moment(new Date()).add(-2, 'days').format("YYYY-MM-DD");
    var k = 0;
    var no_of_days = 0;

    //fetch the active treatment plan
    this.database.activeTreatmentState().then((k) => {
      var active_treatment_plans = k[0];
      var active_state = k[1];
      console.log("active treatment plans: ", active_treatment_plans);
      console.log("active state: ", active_state);


      //check previous two days' reading
      this.database.reading_PastTwoDays(twodaysago, yesterday).then((reading_pasttwodays) => {
        console.log("past 2 days: ", reading_pasttwodays);
        if (Object.keys(reading_pasttwodays).length != 2) {
          //missing data. No change to state.
          console.log("Not enough readings, setting new_state to current state")
          console.log(Object.keys(reading_pasttwodays).length)
          new_state = active_state["treatment_state_id"];
          new_start_date = active_state["date_started"];
        }
        else {
          console.log("There are enough readings to check switch cases.")
          //testing
          // reading_pasttwodays[yesterday]=3;
          // reading_pasttwodays[twodaysago]=1;
          // reading=2;
          // active_state["state_name"]="remission";
          // active_state["treatment_state_id"]=3;

          //beginning of switch cases: determine today's treatment state based on current active state ($active state) and today's reading ($reading)
          console.log(active_state["state_name"])
          switch (active_state["state_name"]) {
            case "maintenance":
              console.log("case: ", active_state["state_name"]);
              if (reading > 4 && (reading_pasttwodays[yesterday] > 4) && (reading_pasttwodays[twodaysago] > 4)) {
                //reading is 5 (+++) or 6 (++++) for 3 consecutive days. Change the state to relapse    
                for (k = 1; k < Object.keys(active_treatment_plans).length; k++) {

                  if (active_treatment_plans[k]["state_name"] == "relapse") {
                    new_state = active_treatment_plans[k]["treatment_state_id"];
                    //set today as state start date
                    new_start_date = moment().format('YYYY-MM-DD') + " 00:00:00";
                    break;
                  }
                }

              } else {
                //state remains as maintenance
                new_state = active_state["treatment_state_id"];
                new_start_date = active_state["date_started"];
              }

              break;

            case "relapse":
              console.log("case: ", active_state["state_name"]);
              if ((reading <3) && (reading_pasttwodays[yesterday] < 3) && (reading_pasttwodays[twodaysago] < 3)) {
                //reading is zero or trace for 3 consecutive days. Change the state to remission
                for (k = 1; k < Object.keys(active_treatment_plans).length; k++) {
                  if (active_treatment_plans[k]["state_name"] == "remission") {
                    //change state to the first remission state
                    new_state = active_treatment_plans[k]["treatment_state_id"];
                    //set today as state start date
                    new_start_date = moment().format('YYYY-MM-DD') + " 00:00:00";
                    break;

                  }
                }

              } else {
                //State remains as relapse
                new_state = active_state["treatment_state_id"];
                new_start_date = active_state["date_started"];
              }
              break;

            case "remission":
              console.log("case: ", active_state["state_name"]);

              if (reading > 4 && (reading_pasttwodays[yesterday] > 4) && (reading_pasttwodays[twodaysago] > 4)) {

                //reading is 5 or 6 for 3 consecutive days. Change the state to relapse
                for (k = 1; k < Object.keys(active_treatment_plans).length; k++) {
                  if (active_treatment_plans[k]["state_name"] == "relapse") {
                    new_state = active_treatment_plans[k]["treatment_state_id"];
                    //set today as state start date
                    new_start_date = moment().format('YYYY-MM-DD') + " 00:00:00";
                    break;
                  }
                }
              } else {

                //today's reading is below 5. Calculate the no. of days passed in current remission state.
                no_of_days = moment().diff(moment(active_state["date_started"], "YYYY-MM-DD HH:mm:ss"), "days") + 1;
                // console.log(no_of_days);
                // //testing
                // active_state["state_duration"]="5";

                //check if state duration has been exceeded
                if (no_of_days > active_state["state_duration"]) {

                  //current remission state duration is exceeded. Move to next remission state / maintenance

                  //check if there's a next remission state
                  var next_id = active_state["treatment_state_id"] + 1
                  var next_remission: boolean = false;


                  for (k = 1; k < Object.keys(active_treatment_plans).length + 1; k++) {
                    if ((active_treatment_plans[k]["treatment_state_id"] == next_id) && (active_treatment_plans[k]["state_name"] == "remission")) {
                      //next remission state exists. Change state to next remission state
                      next_remission = true;
                      new_state = active_treatment_plans[k]["treatment_state_id"];
                      //set today as state start date
                      new_start_date = moment().format('YYYY-MM-DD') + " 00:00:00";
                      break;
                    }
                  }

                  if (next_remission == false) {
                    //next remission state does not exist. Change state back to maintenance
                    for (k = 1; k < Object.keys(active_treatment_plans).length; k++) {
                      if (active_treatment_plans[k]["state_name"] == "maintenance") {
                        new_state = active_treatment_plans[k]["treatment_state_id"];
                        console.log("DEBUG");
                        console.log(new_state);
                        //set today as state start date
                        new_start_date = moment().format('YYYY-MM-DD') + " 00:00:00";
                        break;
                      }
                    }
                  }

                } else {
                  //state duration has not been exceeded. Remain in current remission state
                  new_state = active_state["treatment_state_id"];
                  new_start_date = active_state["date_started"];
                }
              }
              break;

          }
          setTimeout(() => {
            console.log("new_state: ", new_state);
            console.log("new_start_date ", new_start_date);
            // this.database.updateActiveTreatmentState(new_state,new_start_date);
            // this.database.updateActiveTreatmentState(1,"2019-03-31 00:00:00");
          }, 300);
          //end of switch case
        }

        console.log("new_state to store:");
        console.log(new_state);
        console.log("new_start_date to store:");
        console.log(new_start_date);

        let newStateObj = { "new_state": new_state, "new_start_date": new_start_date };
        this.storage.set("new_state_obj", newStateObj)
          .then(() => console.log('Stored new_state = ' + newStateObj + ' in Ion-Storage'))
          .then(() => this.router.navigate(['tabs/tab2/input-reading/confirm-reading', this.reading]))
      })
    })
  }

  goBack() {
    this.router.navigateByUrl("tabs/tab2/pre-reading");
  }

}
