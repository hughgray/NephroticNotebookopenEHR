import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
var FetchReadingService = /** @class */ (function () {
    function FetchReadingService(http, database, platform) {
        this.http = http;
        this.database = database;
        this.platform = platform;
        this.monthly_reading = {};
        this.months_fetched = new Set();
        this.state_details = {};
        this.reading_mapping = {};
        //create the objects for styling preference and inline text
        this.readingcolor_l = { 0: "#ffffff", 1: "#dce977", 2: "#bad36d", 3: "#a5c177", 4: "#90b991", 5: "#70af9a", 6: "#599c8a" };
        this.reading_text = { 0: "No Reading", 1: "Negative", 2: "Trace", 3: "30mg/dL", 4: "100mg/dL", 5: "300mg/dL", 6: "2000mg/dL+" };
        this.symbol_l = { 0: '  .  ', 1: '  -  ', 2: "  T  ", 3: "  +  ", 4: " ++ ", 5: "+++", 6: "++++" };
        this.meds_l = { 0: 'no', 1: 'yes' };
        this.fontsize_l = { 0: '20px', 1: '20px', 2: "20px", 3: "15px", 4: "15px", 5: "15px", 6: "15px" };
        this.treatmentcolor_l = { "maintenance": "#ffffff", "relapse": "rgba(217,0,0,0.5)", "remission": "rgba(244,162,59,0.5)" };
        this.treatmentborder_l = { "maintenance": "2px solid #ffffff", "relapse": "2px solid #D9495C", "remission": "2px solid #F4793B" };
        this.csvData = [];
        this.plan_details = [];
        this.profile_details = [];
        this.current_plan_id = [];
        this.active_state_id = [];
        this.data_log = [];
        this.export_data_log = [];
        this.jsonDays = [];
        this.treatmentUid = [];
    }
    FetchReadingService.prototype.ngOnInit = function () {
    };
    FetchReadingService.prototype.treatmentState = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql('SELECT * FROM treatment_state', [])
                .then(function (data) {
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.state_details[data.rows.item(k).treatment_state_id] =
                            {
                                state: data.rows.item(k).state_name,
                                amt: data.rows.item(k).recc_dose,
                                pillno: data.rows.item(k).doses_per_interval,
                                interval: data.rows.item(k).interval_length
                            };
                    }
                }
                resolve(_this.state_details);
                console.log("Treatment state read: ", _this.state_details);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.activeTreatmentPlanID = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql('SELECT MAX(treatment_state_id) as activeStateId FROM treatment_state', [])
                .then(function (data) {
                _this.active_state_id = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.active_state_id.push({ activeStateId: data.rows.item(0).activeStateId });
                    }
                }
                resolve(_this.active_state_id);
                console.log("Treatment state id read: ", _this.active_state_id);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.treatmentPlanID = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql('SELECT MAX(treatment_plan_id) as planId FROM treatment_plans', [])
                .then(function (data) {
                _this.current_plan_id = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.current_plan_id.push({ planId: data.rows.item(0).planId });
                    }
                }
                resolve(_this.current_plan_id);
                console.log("Treatment plan id read: ", _this.current_plan_id);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.treatmentPlan = function (id) {
        var _this = this;
        return new Promise(function (resolve) {
            var sql = "";
            sql = "SELECT * FROM treatment_state \n               WHERE treatment_plan_id= " + id + "";
            _this.database.db.executeSql(sql, [])
                .then(function (data) {
                _this.plan_details = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.plan_details.push({
                            state: data.rows.item(k).state_name,
                            amt: data.rows.item(k).recc_dose,
                            dur: data.rows.item(k).state_duration,
                            pillno: data.rows.item(k).doses_per_interval,
                            interval: data.rows.item(k).interval_length
                        });
                    }
                }
                resolve(_this.plan_details);
                console.log("Treatment plan read: ", _this.plan_details);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.myProfileDetails = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql('SELECT * FROM profile', [])
                .then(function (data) {
                _this.profile_details = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.profile_details.push({
                            name: data.rows.item(k).patient_name,
                            nhs: data.rows.item(k).nhs_number,
                            doc: data.rows.item(k).doctor_name,
                            num: data.rows.item(k).doctor_contact,
                            birthday: data.rows.item(k).birthday,
                            othermeds: data.rows.item(k).other_meds,
                            ehrid: data.rows.item(k).ehr_id,
                            docId: data.rows.item(k).doctor_id,
                            idType: data.rows.item(k).id_type,
                            cdrProv: data.rows.item(k).cdr_provider
                        });
                    }
                }
                resolve(_this.profile_details);
                console.log("Profile read: ", _this.profile_details);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.treatmentDetails = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql('SELECT MAX(treatment_plan_id) as planId, plan_uid FROM treatment_plans WHERE plan_uid IS NOT NULL', [])
                .then(function (data) {
                _this.treatmentUid = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.treatmentUid.push({
                            planUid: data.rows.item(k).plan_uid,
                            planNo: data.rows.item(k).planId,
                        });
                    }
                }
                resolve(_this.treatmentUid);
                console.log("Plan Uid read: ", _this.treatmentUid);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.readingMapping = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql('SELECT * FROM readings', [])
                .then(function (data) {
                _this.reading_mapping = {};
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.reading_mapping[k + 1] = data.rows.item(k).reading_level;
                    }
                }
                resolve(_this.reading_mapping);
                // console.log("data fetched is: ",this.readings_datafetch);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    //retrieve the daily readings data from database
    FetchReadingService.prototype.monthlyReading = function (startdate, enddate, currentmonth) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql("SELECT * \n              FROM daily_readings \n              WHERE date_of_reading BETWEEN '" + startdate + " 00:00:00' AND '" + enddate + " 23:59:59'\n              ORDER BY date_of_reading;\n              ", [])
                .then(function (data) {
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        var symbol = _this.symbol_l[data.rows.item(k).reading_level_id];
                        var readingstyle_l = { 'color': _this.readingcolor_l[data.rows.item(k).reading_level_id], 'font-size': 'this.fontsize_l[element[1]]',
                            'width': '30px', 'height': '10px', 'margin': '0px', 'padding': '0px' };
                        _this.monthly_reading[data.rows.item(k).date_of_reading.split(' ', 2)[0]] =
                            {
                                reading: data.rows.item(k).reading_level_id,
                                medication_taken: data.rows.item(k).medication_taken,
                                comment: data.rows.item(k).user_comment,
                                stateID: data.rows.item(k).treatment_state_id,
                                readingstyle: readingstyle_l,
                                symbol: symbol
                            };
                    }
                    //keep track of the months fetched
                    _this.months_fetched.add(startdate.slice(0, -3));
                    _this.months_fetched.add(enddate.slice(0, -3));
                    _this.months_fetched.add(currentmonth);
                }
                console.log(_this.monthly_reading);
                resolve(_this.monthly_reading);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.dataLog = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql("SELECT date_of_reading, reading_level_id, medication_taken, user_comment\n              FROM daily_readings \n              ORDER BY date_of_reading DESC;\n              ", [])
                .then(function (data) {
                _this.data_log = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        var symbol = _this.symbol_l[data.rows.item(k).reading_level_id];
                        var date = data.rows.item(k).date_of_reading.split(' ', 2)[0];
                        var taken = _this.meds_l[data.rows.item(k).medication_taken];
                        _this.data_log.push({
                            date: date,
                            reading: data.rows.item(k).reading_level_id,
                            meds: data.rows.item(k).medication_taken,
                            symbol: symbol,
                            meds_taken: taken
                        });
                    }
                }
                console.log("got from db", _this.data_log);
                resolve(_this.data_log);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.exportDataLog = function (startdate, enddate) {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('date: :', startdate, enddate);
            startdate = startdate.split(' ', 2)[0];
            enddate = enddate.split(' ', 2)[0];
            _this.database.db.executeSql("SELECT date_of_reading, reading_level_id, medication_taken, user_comment, recc_dose, doses_per_interval, interval_length\n              FROM daily_readings d, treatment_state s\n              WHERE date_of_reading BETWEEN '" + startdate + " 00:00:00' AND '" + enddate + " 23:59:59' AND\n              d.treatment_state_id=s.treatment_state_id\n              ORDER BY date_of_reading DESC;\n              ", [])
                .then(function (data) {
                _this.export_data_log = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        var symbol = _this.symbol_l[data.rows.item(k).reading_level_id];
                        var Date_1 = data.rows.item(k).date_of_reading.split(' ', 2)[0];
                        var Taken = _this.meds_l[data.rows.item(k).medication_taken];
                        _this.export_data_log.push({
                            Date: Date_1,
                            Reading: symbol,
                            Dose: data.rows.item(k).recc_dose,
                            Times: data.rows.item(k).doses_per_interval,
                            Interval: data.rows.item(k).interval_length,
                            Taken: Taken,
                            Comment: data.rows.item(k).user_comment,
                        });
                    }
                }
                resolve(_this.export_data_log);
                console.log(_this.export_data_log);
                console.log("start", startdate);
                console.log("end", enddate);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService.prototype.getJsonReadings = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.db.executeSql("SELECT *\n              FROM jsonReadings", [])
                .then(function (data) {
                _this.jsonDays = [];
                if (data.rows.length > 0) {
                    var k;
                    for (k = 0; k < data.rows.length; k++) {
                        _this.jsonDays.push({
                            Number: data.rows.item(k).jsonNo,
                            Body: data.rows.item(k).jsonReading,
                        });
                    }
                }
                console.log("got from db", _this.jsonDays);
                resolve(_this.jsonDays);
            })
                .catch(function (error) {
                console.log("Error: " + JSON.stringify(error.err));
            });
        });
    };
    FetchReadingService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Http, DatabaseService, Platform])
    ], FetchReadingService);
    return FetchReadingService;
}());
export { FetchReadingService };
//# sourceMappingURL=fetch-reading.service.js.map