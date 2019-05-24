//the csv functions are adopted from https://devdactic.com/csv-data-ionic/
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import * as papa from 'papaparse';
import { Http } from '@angular/http';
import * as moment from 'moment';

// Our DB Schema

// Reading Level Table
// CREATE TABLE reading_level(reading_level_id integer primary key, reading_level text);

// Profile Table
// CREATE TABLE profile(patient_name text, birthday text, doctor_name text, doctor_contact text, other_meds text);

// Treatment Plans Table
// CREATE TABLE treatment_plans(treatment_plan_id integer primary key, date_created text, doctor_name text, foreign key(doctor_name) references profile(doctor_name));

// Active Treatment Plan
// CREATE TABLE active_treatment_plan(active_treatment_plan_id integer, foreign key(active_treatment_plan_id) references treatment_plans(treatment_plan_id));

// Treatment States Table
// CREATE TABLE treatment_states(treatment_state_id integer primary key, treatment_plan_id integer, state_name text, state_duration integer, recc_dose integer, doses_per_interval integer, interval_length integer, foreign key(treatment_plan_id) references treatment_plans(treatment_plan_id));

// Daily Readings Table
// CREATE TABLE daily_readings(date_of_reading text primary key, reading_level_id integer, medication_taken integer, user_comment text, treatment_state_id integer, foreign key(treatment_state_id) references treatment_state(treatment_state_id), foreign key(reading_level_id) references reading_level(reading_level_id))

@Injectable({
   providedIn: 'root'
})
export class DatabaseService {

   db: SQLiteObject;
   readings_datafetch: object = {};
   csvData: any[] = [];
   doQuery_datafetch: any;
   active_treatment_plan: object = {};
   active_state: object = {};
   now: string;   

   constructor(
      public sql: SQLite,
      public platform: Platform,
      private http: Http) {
      this.now = moment().format('YYYY-MM-DD') + ' 00:00:00';
      this.platform.ready().then(() => {
         this.callDatabase().then((data: any) => {
            this.insertDummyData().then(() => {
         //    //    // this.retrieveData_treatment_state();
         //    //    // this.activeTreatmentState();
         //    //    // })
            })
         })
      })
   }

   //retrieve sqlite data

   public callDatabase(): Promise<any> {
      return new Promise(resolve => {
         this.sql.create({
            name: 'nephrotic.db',
            location: 'default' // the location field is required
         })
            .then((db: SQLiteObject) => {
               this.db = db;
               console.log(this.db.openDBs);

               this.createTable();
               // this.insertData('abc','daily_readings');

               resolve(this.db);


            })
            .catch((err: any) => {
               console.error('Unable to open database: ', err);
            });
      });
   }

   //create table
   public createTable(): void {
      // this.db.executeSql('DROP TABLE IF EXISTS readings');
      // this.db.executeSql('DROP TABLE IF EXISTS daily_readings');
      // this.db.executeSql('DROP TABLE IF EXISTS treatment_state');
      // this.db.executeSql('DROP TABLE IF EXISTS treatment_plans');
      // this.db.executeSql('DROP TABLE IF EXISTS active_treatment_state');
      // this.db.executeSql('DROP TABLE IF EXISTS profile');


      //create readings table
      this.db.executeSql(`CREATE TABLE IF NOT EXISTS readings (
                        reading_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        reading_level TEXT
                        )`,
         <any>{})
         .then((data: any) => {
            console.log("create/open readings table - successful");
         })
         .catch((error: any) => {
            console.log("Error in readings: " + JSON.stringify(error.err));
         });

      //create profile table
      this.db.executeSql(`CREATE TABLE IF NOT EXISTS profile (
                     patient_name TEXT PRIMARY KEY, 
                     birthday TEXT, 
                     doctor_name TEXT, 
                     doctor_contact TEXT,
                     other_meds TEXT
                     )`,
         <any>{})
         .then((data: any) => {
            console.log("create/open profile table - successful");
         })
         .catch((error: any) => {
            console.log("Error in profile: " + JSON.stringify(error.err));
         });

      //create treatment_plans table
      this.db.executeSql(`CREATE TABLE IF NOT EXISTS treatment_plans(
                     treatment_plan_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                     date_created TEXT, 
                     doctor_name TEXT
                     )`,
         <any>{})
         .then((data: any) => {
            console.log("create/open treatment_plans table - successful");
         })
         .catch((error: any) => {
            console.log("Error in treatment_plans: " + JSON.stringify(error.err));
         });

      //create active_treatment_state table
      this.db.executeSql(`CREATE TABLE IF NOT EXISTS active_treatment_state (
                           active_treatment_state_id INTEGER PRIMARY KEY, 
                           date_started TEXT
                           )`,
         <any>{})
         .then((data: any) => {
            console.log("create/open active_treatment_state table - successful");
         })
         .catch((error: any) => {
            console.log("Error in active_treatment_state: " + JSON.stringify(error.err));
         });

      //create treatment_state table
      this.db.executeSql(`CREATE TABLE IF NOT EXISTS treatment_state (
                        treatment_state_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        treatment_plan_id INTEGER,
                        state_name TEXT,
                        state_duration INTEGER,
                        recc_dose INTEGER,
                        doses_per_interval INTEGER,
                        interval_length INTEGER
                        )`
         , <any>{})
         .then((data: any) => {
            console.log("create/open treatment_state table - successful");
         })
         .catch((error: any) => {
            console.log("Error in treatment_state: " + JSON.stringify(error.err));
         });

      //create daily_readings table
      this.db.executeSql(`CREATE TABLE IF NOT EXISTS daily_readings (
                              date_of_reading TEXT PRIMARY KEY, 
                              reading_level_id TEXT,
                              medication_taken INTEGER,
                              user_comment TEXT,
                              treatment_state_id INTEGER
                              )`
         , <any>{})
         .then((data: any) => {
            console.log("create/open daily_readings table - successful");
         })
         .catch((error: any) => {
            console.log("Error in daily_readings: " + JSON.stringify(error.err));
         });
   }

   public insertData(v: any, table: string): Promise<any> {
      return new Promise(resolve => {
         let sql: string = "";
         if (table == "readings") {
            sql = "INSERT INTO readings(reading_level) VALUES('" + v + "')";

         } else if (table == "profile") {
            sql = `INSERT INTO profile(
               patient_name,
               birthday, 
               doctor_name, 
               doctor_contact)
               VALUES('`+ v[0] + `',
                      '`+ v[1] + `',
                      '`+ v[2] + `',
                      '`+ v[3] + `')`;

         } else if (table == "profileUpdate") {
            sql = `UPDATE profile SET 
            patient_name = '`+ v[0] + `', 
            birthday = '`+ v[1] + `',
            doctor_name = '`+ v[2] + `', 
            doctor_contact = '`+ v[3] + `', 
            other_meds = '`+ v[4] + `'
            WHERE patient_name IS NOT NULL`;

         } else if (table == "profileOtherMeds") {
            sql = `UPDATE profile
                   SET other_meds = '`+ v["other_meds"] + `'
                   WHERE other_meds IS NULL`;

         } else if (table == "profileDoc") {
            sql = `INSERT INTO treatment_plans(
               treatment_plan_id, 
               date_created, 
               doctor_name)
               VALUES(NULL,
                  '`+ this.now + `',
                  '`+ v["doctor_name"] + `')`;

         } else if (table == "daily_readings") {
            sql = `INSERT INTO daily_readings(
               date_of_reading, 
               reading_level_id, 
               medication_taken, 
               user_comment, 
               treatment_state_id)
               VALUES('` + v[0] + `',` + v[1] + `,` + v[2] + `,` + v[3] + `,` + v[4] + `)`;

         } else if (table == "daily_readingsReal") {
            sql = `INSERT INTO daily_readings(
                  date_of_reading, 
                  reading_level_id, 
                  medication_taken, 
                  user_comment, 
                  treatment_state_id)
                  VALUES('`+ this.now + `',
                         `+ v["reading_level_id"] + `,
                         `+ v["medication_taken"] + `,
                         '`+ v["user_comment"] + `',
                         `+ v["treatment_state_id"] + `)`;

            console.log(v);
            console.log(sql);


         } else if (table == "treatment_stateUpdate") {
            sql = `INSERT INTO treatment_state( 
               treatment_state_id,
               treatment_plan_id,
               state_name,
               state_duration,
               recc_dose,
               doses_per_interval,
               interval_length)
               VALUES(NULL,
                     ` + v[0] + `,
                     '`+ v[1] + `',
                     `+ v[2] + `,
                     `+ v[3] + `,
                     `+ v[4] + `,
                     `+ v[5] + `)`;

         } else if (table == "treatment_stateReal") {
            sql = `INSERT INTO treatment_state( 
               treatment_state_id,
               treatment_plan_id,
               state_name,
               state_duration,
               recc_dose,
               doses_per_interval,
               interval_length)
               VALUES(NULL,
                     ` + v[0] + `,
                     '` + v[1] + `',
                     ` + v[2] + `,
                     ` + v[3] + `,
                     ` + v[4] + `,
                     ` + v[5] + `)`;

         } else if (table == "active_treatment_state") {
            sql = `INSERT INTO active_treatment_state(
               active_treatment_state_id, 
               date_started)
               VALUES(` + v[0] + `,'` + v[1] + `')`;
            console.log(sql);
         }

         this.db.executeSql(sql, <any>{})
            .then((data: any) => {
               resolve(true);
               console.log("row inserted in", table);
            })
            .catch((error: any) => {
               console.log("Error in ", table, + JSON.stringify(error.err));
            });
      });
   }


   public deleteData(v: string): Promise<any> {
      return new Promise(resolve => {
         let sql = "DELETE FROM readings WHERE reading_level= '" + v + "'";
         this.db.executeSql(sql, <any>{})
            .then((data: any) => {
               resolve(true);
               console.log("row deleted");
            })
            .catch((error: any) => {
               console.log("Error " + JSON.stringify(error.err));
            });
      });
   }

   public profileExists(): Promise<any> {
      return new Promise(resolve => {
         this.db.executeSql('SELECT COUNT(*) FROM profile', [])
            .then((data: any) => {

               if (data.rows.item(0)["COUNT(*)"] == 0) {
                  //profile doesn't exist
                  console.log("profile does not exist");
                  resolve(false);
               } else {
                  //profile exists
                  console.log("profile exists");
                  resolve(true);
               }
            });
      });
   }

   public retrieveData_treatment_state(): Promise<any> {
      return new Promise(resolve => {
         this.db.executeSql('SELECT * FROM active_treatment_state', [])
            .then((data: any) => {
               this.readings_datafetch = {};
               if (data.rows.length > 0) {
                  // console.log("data fetched is: ",this.readings_datafetch);
                  console.log("row found");

                  var k;
                  for (k = 0; k < data.rows.length; k++) {
                     this.readings_datafetch[k + 1] = data.rows.item(k);
                  }
               }

               resolve(this.readings_datafetch);
               console.log("active treatment state fetched is: ", this.readings_datafetch);

            })
            .catch((error) => {
               console.log("Error: " + JSON.stringify(error.err));
            });
      });
   }

   public activeTreatmentState(): Promise<any> {
      return new Promise(resolve => {
         this.db.executeSql(`
            SELECT * FROM treatment_state
            WHERE treatment_plan_id in (
               SELECT MAX(treatment_plan_id) as most_recent
               FROM treatment_plans
            )
            `, [])
            .then((data: any) => {
               this.active_treatment_plan = {};
               if (data.rows.length > 0) {
                  // console.log("data fetched is: ",this.readings_datafetch);
                  console.log("row found");

                  var k;
                  for (k = 0; k < data.rows.length; k++) {
                     this.active_treatment_plan[k + 1] = data.rows.item(k);
                  }
               }

            })
            .catch((error) => {
               console.log("Error: " + JSON.stringify(error.err));
            });

         //obtain the active treatment state and start date
         this.db.executeSql(`
            SELECT *
            FROM active_treatment_state a,treatment_state t
            WHERE t.treatment_state_ID=a.active_treatment_state_id
            `, [])
            .then((data: any) => {
               this.active_state = {};
               var k;
               for (k = 0; k < data.rows.length; k++) {
                  this.active_state = data.rows.item(k);
               }
               resolve([this.active_treatment_plan, this.active_state]);

            })
            .catch((error) => {
               console.log("Error: " + JSON.stringify(error.err));
            });

      });
   }

   public reading_PastTwoDays(startdate, enddate): Promise<any> {
      return new Promise(resolve => {
         this.db.executeSql(
            `SELECT * 
            FROM daily_readings 
            WHERE date_of_reading BETWEEN '`+ startdate + ` 00:00:00' AND '` + enddate + ` 23:59:59'
            ORDER BY date_of_reading;
            `, [])
            .then((data: any) => {
               var reading_pasttwodays = {};
               var k;
               for (k = 0; k < data.rows.length; k++) {
                  reading_pasttwodays[data.rows.item(k).date_of_reading.split(' ', 2)[0]] = data.rows.item(k).reading_level_id;
               }
               resolve(reading_pasttwodays);
            })
            .catch((error: any) => {
               console.log("Error " + JSON.stringify(error.err));
            });
      });
   }

   public updateActiveTreatmentState(id, date): Promise<any> {
      return new Promise(resolve => {
         let sql = `UPDATE active_treatment_state
                   SET active_treatment_state_id = `+ id + `,
                       date_started='`+ date + `'`;

         this.db.executeSql(sql, <any>{})
            .then((data: any) => {
               resolve(true);
               console.log("row updated in active treatment state");
            })
            .catch((error: any) => {
               console.log("Error " + JSON.stringify(error.err));
            });
      });
   }

   public updateData_testing(): Promise<any> {
      return new Promise(resolve => {
         let sql = `UPDATE treatment_state
                   SET state_name = "maintenance" 
                   WHERE state_name="maintenance"`;

         this.db.executeSql(sql, <any>{})
            .then((data: any) => {
               resolve(true);
               console.log("row updated in treatment state");
            })
            .catch((error: any) => {
               console.log("Error " + JSON.stringify(error.err));
            });
      });
   }

   public doQuery(sqlQuery): Promise<any> {
      return new Promise(resolve => {
         this.db.executeSql(sqlQuery, [])
            .then((data: any) => {
               this.doQuery_datafetch = {};
               if (data.rows.length > 0) {
                  // console.log("data fetched is: ",this.readings_datafetch);
                  console.log("row found");

                  // loop through rows
                  var k;
                  for (k = 0; k < data.rows.length; k++) {
                     this.doQuery_datafetch[k + 1] = data.rows.item(k);
                  }
               }
               else {
                  console.log("Query returns no results.")
               }

               resolve(this.doQuery_datafetch);
               console.log("data fetched is: ", this.doQuery_datafetch);

            })
            .catch((error) => {
               console.log("Error: " + JSON.stringify(error.err));
            });
      });
   }

   // insert dummy data
   public insertDummyData(): Promise<any> {
      return new Promise(resolve => {

         // ---------------------------- default dummy data ---------------------------
         // this.readCsvData('/assets/dummy/dummy_reading.csv', 'readings');
         // this.readCsvData('../assets/dummy/dummy_dailyreading.csv', 'daily_readings');
         // this.readCsvData('/assets/dummy/dummy_treatmentstatus.csv','treatment_state')

         // ---------------------------- maintenance dummy ---------------------------
         // this.readCsvData('/assets/dummy/main.csv','daily_readings');
         
         // ---------------------------- rel to rem dummy ---------------------------
         // this.readCsvData('/assets/dummy/rel-to-rem.csv','daily_readings');

         // -------------------------- custom test case dummy data ----------------------
         // this.readCsvData('/assets/dummy/dummy_reading.csv', 'readings');

         // -------------------------- stress test dummy data ----------------------
         // this.readCsvData('/assets/dummy/main-to-relapse/dummy_dailyreading.csv', 'daily_readings');

         // --------------------------- uncomment this when inserting dummys -------------
         // setTimeout(() => { resolve(); }, 1000);
      });
   }

   //work with csv
   public readCsvData(f, table) {
      this.http.get(f)
         .subscribe(
            data => this.extractData(data, table),
            err => this.handleError(err)
         );
   }

   //get data from csv file
   public extractData(res, table) {
      let csvData = res['_body'] || '';
      let parsedData = papa.parse(csvData).data;

      // this.headerRow = parsedData[0];

      // parsedData.splice(0, 1);
      this.csvData = parsedData;
      if (this.csvData == []) {
         console.log("data not found");
      } else {
         if (table == "readings") {
            var i: number;
            for (i = 0; i < this.csvData.length; i++) {
               let v = this.csvData[i][0];
               this.insertData(v, 'readings');
            }

         } else if (table == "daily_readings") {
            var i: number;
            for (i = 0; i < this.csvData.length; i++) {
               let v = this.csvData[i];
               this.insertData(v, 'daily_readings').then(() => {
                  return "done";
               });
            }

         } else if (table == "treatment_state") {
            var i: number;
            for (i = 0; i < this.csvData.length; i++) {
               let v = this.csvData[i];
               this.insertData(v, 'treatment_state').then(() => {
                  return "done";
               });
            }
         }

      }
   }

   //work with csv
   public handleError(err) {
      console.log('something went wrong: ', err);
   }
}