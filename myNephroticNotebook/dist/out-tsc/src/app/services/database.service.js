import * as tslib_1 from "tslib";
//the csv functions are adopted from https://devdactic.com/csv-data-ionic/
import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
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
var DatabaseService = /** @class */ (function () {
    function DatabaseService(sql, platform, http) {
        var _this = this;
        this.sql = sql;
        this.platform = platform;
        this.http = http;
        this.readings_datafetch = {};
        this.csvData = [];
        this.active_treatment_plan = {};
        this.active_state = {};
        this.now = moment().format('YYYY-MM-DD') + ' 00:00:00';
        this.nowT = moment().format('YYYY-MM-DD hh:mm');
        this.platform.ready().then(function () {
            _this.callDatabase().then(function (data) {
                _this.insertDummyData().then(function () {
                    //    //    // this.retrieveData_treatment_state();
                    //    //    // this.activeTreatmentState();
                    //    //    // })
                });
            });
        });
    }
    //retrieve sqlite data
    DatabaseService.prototype.callDatabase = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.sql.create({
                name: 'nephrotic.db',
                location: 'default' // the location field is required
            })
                .then(function (db) {
                _this.db = db;
                console.log(_this.db.openDBs);
                _this.createTable();
                // this.insertData('abc','daily_readings');
                resolve(_this.db);
            })
                .catch(function (err) {
                console.error('Unable to open database: ', err);
            });
        });
    };
    //create table
    DatabaseService.prototype.createTable = function () {
        // this.db.executeSql('DROP TABLE IF EXISTS readings');
        // this.db.executeSql('DROP TABLE IF EXISTS daily_readings');
        // this.db.executeSql('DROP TABLE IF EXISTS treatment_state');
        // this.db.executeSql('DROP TABLE IF EXISTS treatment_plans');
        // this.db.executeSql('DROP TABLE IF EXISTS active_treatment_state');
        // this.db.executeSql('DROP TABLE IF EXISTS profile');
        //create readings table
        this.db.executeSql("CREATE TABLE IF NOT EXISTS readings (\n                        reading_id INTEGER PRIMARY KEY AUTOINCREMENT, \n                        reading_level TEXT\n                        )", {})
            .then(function (data) {
            console.log("create/open readings table - successful");
        })
            .catch(function (error) {
            console.log("Error in readings: " + JSON.stringify(error.err));
        });
        //create profile table
        this.db.executeSql("CREATE TABLE IF NOT EXISTS profile (\n                     patient_name TEXT PRIMARY KEY, \n                     nhs_number TEXT,\n                     birthday TEXT, \n                     doctor_name TEXT, \n                     doctor_contact TEXT,\n                     doctor_id TEXT,\n                     id_type TEXT,\n                     cdr_provider TEXT,\n                     other_meds TEXT,\n                     ehr_id TEXT\n                     )", {})
            .then(function (data) {
            console.log("create/open profile table - successful");
        })
            .catch(function (error) {
            console.log("Error in profile: " + JSON.stringify(error.err));
        });
        //create treatment_plans table
        this.db.executeSql("CREATE TABLE IF NOT EXISTS treatment_plans(\n                     treatment_plan_id INTEGER PRIMARY KEY AUTOINCREMENT, \n                     date_created TEXT, \n                     doctor_name TEXT,\n                     plan_uid TEXT\n                     )", {})
            .then(function (data) {
            console.log("create/open treatment_plans table - successful");
        })
            .catch(function (error) {
            console.log("Error in treatment_plans: " + JSON.stringify(error.err));
        });
        //create active_treatment_state table
        this.db.executeSql("CREATE TABLE IF NOT EXISTS active_treatment_state (\n                           active_treatment_state_id INTEGER PRIMARY KEY, \n                           date_started TEXT\n                           )", {})
            .then(function (data) {
            console.log("create/open active_treatment_state table - successful");
        })
            .catch(function (error) {
            console.log("Error in active_treatment_state: " + JSON.stringify(error.err));
        });
        //create treatment_state table
        this.db.executeSql("CREATE TABLE IF NOT EXISTS treatment_state (\n                        treatment_state_id INTEGER PRIMARY KEY AUTOINCREMENT, \n                        treatment_plan_id INTEGER,\n                        state_name TEXT,\n                        state_duration INTEGER,\n                        recc_dose INTEGER,\n                        doses_per_interval INTEGER,\n                        interval_length INTEGER\n                        )", {})
            .then(function (data) {
            console.log("create/open treatment_state table - successful");
        })
            .catch(function (error) {
            console.log("Error in treatment_state: " + JSON.stringify(error.err));
        });
        //create daily_readings table
        this.db.executeSql("CREATE TABLE IF NOT EXISTS daily_readings (\n                              date_of_reading TEXT PRIMARY KEY, \n                              reading_level_id TEXT,\n                              medication_taken INTEGER,\n                              user_comment TEXT,\n                              treatment_state_id INTEGER\n                              )", {})
            .then(function (data) {
            console.log("create/open daily_readings table - successful");
        })
            .catch(function (error) {
            console.log("Error in daily_readings: " + JSON.stringify(error.err));
        });
        //create daily_readings table
        this.db.executeSql("CREATE TABLE IF NOT EXISTS jsonReadings (\n                              jsonNo INTEGER PRIMARY KEY AUTOINCREMENT,\n                              jsonReading TEXT,\n                              compUid TEXT\n                              )", {})
            .then(function (data) {
            console.log("create/open jsonReadings table - successful");
        })
            .catch(function (error) {
            console.log("Error in jsonReadings: " + JSON.stringify(error.err));
        });
    };
    DatabaseService.prototype.insertData = function (v, table) {
        var _this = this;
        return new Promise(function (resolve) {
            var sql = "";
            if (table == "readings") {
                sql = "INSERT INTO readings(reading_level) VALUES('" + v + "')";
            }
            else if (table == "profile") {
                sql = "INSERT INTO profile(\n               patient_name,\n               nhs_number,\n               birthday, \n               doctor_name, \n               doctor_contact,\n               doctor_id,\n               id_type,\n               cdr_provider)\n               VALUES('" + v[0] + "',\n                      '" + v[1] + "',\n                      '" + v[2] + "',\n                      '" + v[3] + "',\n                      '" + v[4] + "',\n                      '" + v[5] + "',\n                      '" + v[6] + "',\n                      '" + v[7] + "')";
            }
            else if (table == "profileUpdate") {
                sql = "UPDATE profile SET \n            patient_name = '" + v[0] + "', \n            nhs_number = '" + v[1] + "', \n            birthday = '" + v[2] + "',\n            doctor_name = '" + v[3] + "', \n            doctor_contact = '" + v[4] + "', \n            other_meds = '" + v[5] + "',\n            doctor_id = '" + v[6] + "',\n            id_type = '" + v[7] + "',\n            cdr_provider = '" + v[8] + "'\n            WHERE patient_name IS NOT NULL";
            }
            else if (table == "profileOtherMeds") {
                sql = "UPDATE profile\n                   SET other_meds = '" + v["other_meds"] + "'\n                   WHERE other_meds IS NULL";
            }
            else if (table == "profileEHRid") {
                sql = "UPDATE profile\n                   SET ehr_id = '" + v["ehr_id"] + "'\n                   WHERE ehr_id IS NULL";
            }
            else if (table == "profileEHRidUpdate") {
                sql = "UPDATE profile\n                   SET ehr_id = '" + v["ehr_id"] + "'\n                   WHERE ehr_id IS NOT NULL";
            }
            else if (table == "profileDoc") {
                sql = "INSERT INTO treatment_plans(\n               treatment_plan_id, \n               date_created, \n               doctor_name)\n               VALUES(NULL,\n                  '" + _this.nowT + "',\n                  '" + v["doctor_name"] + "')";
            }
            else if (table == "treatmentUid") {
                sql = "UPDATE treatment_plans\n               SET plan_uid = '" + v["planUid"] + "'\n               WHERE date_created =  '" + _this.nowT + "'";
            }
            else if (table == "daily_readings") {
                sql = "INSERT INTO daily_readings(\n               date_of_reading, \n               reading_level_id, \n               medication_taken, \n               user_comment, \n               treatment_state_id)\n               VALUES('" + v[0] + "'," + v[1] + "," + v[2] + "," + v[3] + "," + v[4] + ")";
            }
            else if (table == "daily_readingsReal") {
                sql = "INSERT INTO daily_readings(\n                  date_of_reading, \n                  reading_level_id, \n                  medication_taken, \n                  user_comment, \n                  treatment_state_id)\n                  VALUES('" + _this.now + "',\n                         " + v["reading_level_id"] + ",\n                         " + v["medication_taken"] + ",\n                         '" + v["user_comment"] + "',\n                         " + v["treatment_state_id"] + ")";
                console.log(v);
                console.log(sql);
            }
            else if (table == "treatment_stateUpdate") {
                sql = "INSERT INTO treatment_state( \n               treatment_state_id,\n               treatment_plan_id,\n               state_name,\n               state_duration,\n               recc_dose,\n               doses_per_interval,\n               interval_length)\n               VALUES(NULL,\n                     " + v[0] + ",\n                     '" + v[1] + "',\n                     " + v[2] + ",\n                     " + v[3] + ",\n                     " + v[4] + ",\n                     " + v[5] + ")";
            }
            else if (table == "treatment_stateReal") {
                sql = "INSERT INTO treatment_state( \n               treatment_state_id,\n               treatment_plan_id,\n               state_name,\n               state_duration,\n               recc_dose,\n               doses_per_interval,\n               interval_length)\n               VALUES(NULL,\n                     " + v[0] + ",\n                     '" + v[1] + "',\n                     " + v[2] + ",\n                     " + v[3] + ",\n                     " + v[4] + ",\n                     " + v[5] + ")";
            }
            else if (table == "active_treatment_state") {
                sql = "INSERT INTO active_treatment_state(\n               active_treatment_state_id, \n               date_started)\n               VALUES(" + v[0] + ",'" + v[1] + "')";
                console.log(sql);
            }
            else if (table == "jsonReadings") {
                sql = "INSERT INTO jsonReadings(\n               jsonNo,\n               jsonReading)\n               VALUES(NULL,\n                     '" + v["jsonReading"] + "')";
            }
            else if (table == "jsonReadingsUid") {
                sql = "UPDATE jsonReadings\n                   SET compUid = '" + v["compUid"] + "'\n                   WHERE jsonNo=  " + v["jsonNo"] + "";
            }
            _this.db.executeSql(sql, {})
                .then(function (data) {
                resolve(true);
                console.log("row inserted in", table);
            })
                .catch(function (error) {
                console.log("Error in ", table, +JSON.stringify(error));
            });
        });
    };
    DatabaseService.prototype.dropJsonData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var sql = "DELETE FROM jsonReadings WHERE compUid IS NOT NULL";
            _this.db.executeSql(sql, {})
                .then(function (data) {
                resolve(true);
                console.log("row(s) deleted from json table");
            })
                .catch(function (error) {
                console.log("Error in jsonReadings" + JSON.stringify(error.err));
            });
        });
    };
    DatabaseService.prototype.deleteData = function (v) {
        var _this = this;
        return new Promise(function (resolve) {
            var sql = "DELETE FROM readings WHERE reading_level= '" + v + "'";
            _this.db.executeSql(sql, {})
                .then(function (data) {
                resolve(true);
                console.log("row deleted");
            })
                .catch(function (error) {
                console.log("Error " + JSON.stringify(error.err));
            });
        });
    };
    DatabaseService.prototype.profileExists = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.executeSql('SELECT COUNT(*) FROM profile', [])
                .then(function (data) {
                if (data.rows.item(0)["COUNT(*)"] == 0) {
                    //profile doesn't exist
                    console.log("profile does not exist");
                    resolve(false);
                }
                else {
                    //profile exists
                    console.log("profile exists");
                    resolve(true);
                }
            });
        });
    };
    DatabaseService.prototype.retrieveData_treatment_state = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.executeSql('SELECT * FROM active_treatment_state', [])
                .then(function (data) {
                _this.readings_datafetch = {};
                if (data.rows.length > 0) {
                    // console.log("data fetched is: ",this.readings_datafetch);
                    console.log("row found");
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.readings_datafetch[k + 1] = data.rows.item(k);
                    }
                }
                resolve(_this.readings_datafetch);
                console.log("active treatment state fetched is: ", _this.readings_datafetch);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    DatabaseService.prototype.activeTreatmentState = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.executeSql("\n            SELECT * FROM treatment_state\n            WHERE treatment_plan_id in (\n               SELECT MAX(treatment_plan_id) as most_recent\n               FROM treatment_plans\n            )\n            ", [])
                .then(function (data) {
                _this.active_treatment_plan = {};
                if (data.rows.length > 0) {
                    // console.log("data fetched is: ",this.readings_datafetch);
                    console.log("row found");
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.active_treatment_plan[k + 1] = data.rows.item(k);
                    }
                }
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
            //obtain the active treatment state and start date
            _this.db.executeSql("\n            SELECT *\n            FROM active_treatment_state a,treatment_state t\n            WHERE t.treatment_state_ID=a.active_treatment_state_id\n            ", [])
                .then(function (data) {
                _this.active_state = {};
                var k;
                for (k = 0; k < data.rows.length; k++) {
                    _this.active_state = data.rows.item(k);
                }
                resolve([_this.active_treatment_plan, _this.active_state]);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    DatabaseService.prototype.reading_PastTwoDays = function (startdate, enddate) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.executeSql("SELECT * \n            FROM daily_readings \n            WHERE date_of_reading BETWEEN '" + startdate + " 00:00:00' AND '" + enddate + " 23:59:59'\n            ORDER BY date_of_reading;\n            ", [])
                .then(function (data) {
                var reading_pasttwodays = {};
                var k;
                for (k = 0; k < data.rows.length; k++) {
                    reading_pasttwodays[data.rows.item(k).date_of_reading.split(' ', 2)[0]] = data.rows.item(k).reading_level_id;
                }
                resolve(reading_pasttwodays);
            })
                .catch(function (error) {
                console.log("Error " + JSON.stringify(error.err));
            });
        });
    };
    DatabaseService.prototype.updateActiveTreatmentState = function (id, date) {
        var _this = this;
        return new Promise(function (resolve) {
            var sql = "UPDATE active_treatment_state\n                   SET active_treatment_state_id = " + id + ",\n                       date_started='" + date + "'";
            _this.db.executeSql(sql, {})
                .then(function (data) {
                resolve(true);
                console.log("row updated in active treatment state");
            })
                .catch(function (error) {
                console.log("Error " + JSON.stringify(error.err));
            });
        });
    };
    DatabaseService.prototype.updateData_testing = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var sql = "UPDATE treatment_state\n                   SET state_name = \"maintenance\" \n                   WHERE state_name=\"maintenance\"";
            _this.db.executeSql(sql, {})
                .then(function (data) {
                resolve(true);
                console.log("row updated in treatment state");
            })
                .catch(function (error) {
                console.log("Error " + JSON.stringify(error.err));
            });
        });
    };
    DatabaseService.prototype.doQuery = function (sqlQuery) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.executeSql(sqlQuery, [])
                .then(function (data) {
                _this.doQuery_datafetch = {};
                if (data.rows.length > 0) {
                    // console.log("data fetched is: ",this.readings_datafetch);
                    console.log("row found");
                    // loop through rows
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.doQuery_datafetch[k + 1] = data.rows.item(k);
                    }
                }
                else {
                    console.log("Query returns no results.");
                }
                resolve(_this.doQuery_datafetch);
                console.log("data fetched is: ", _this.doQuery_datafetch);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    // insert dummy data
    DatabaseService.prototype.insertDummyData = function () {
        return new Promise(function (resolve) {
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
    };
    //work with csv
    DatabaseService.prototype.readCsvData = function (f, table) {
        var _this = this;
        this.http.get(f)
            .subscribe(function (data) { return _this.extractData(data, table); }, function (err) { return _this.handleError(err); });
    };
    //get data from csv file
    DatabaseService.prototype.extractData = function (res, table) {
        var csvData = res['_body'] || '';
        var parsedData = papa.parse(csvData).data;
        // this.headerRow = parsedData[0];
        // parsedData.splice(0, 1);
        this.csvData = parsedData;
        if (this.csvData == []) {
            console.log("data not found");
        }
        else {
            if (table == "readings") {
                var i;
                for (i = 0; i < this.csvData.length; i++) {
                    var v = this.csvData[i][0];
                    this.insertData(v, 'readings');
                }
            }
            else if (table == "daily_readings") {
                var i;
                for (i = 0; i < this.csvData.length; i++) {
                    var v = this.csvData[i];
                    this.insertData(v, 'daily_readings').then(function () {
                        return "done";
                    });
                }
            }
            else if (table == "treatment_state") {
                var i;
                for (i = 0; i < this.csvData.length; i++) {
                    var v = this.csvData[i];
                    this.insertData(v, 'treatment_state').then(function () {
                        return "done";
                    });
                }
            }
        }
    };
    //work with csv
    DatabaseService.prototype.handleError = function (err) {
        console.log('something went wrong: ', err);
    };
    DatabaseService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [SQLite,
            Platform,
            Http])
    ], DatabaseService);
    return DatabaseService;
}());
export { DatabaseService };
//# sourceMappingURL=database.service.js.map