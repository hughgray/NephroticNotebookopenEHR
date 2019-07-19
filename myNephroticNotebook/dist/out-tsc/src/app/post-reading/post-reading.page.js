import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ApiService } from '../services/api.service';
var PostReadingPage = /** @class */ (function () {
    function PostReadingPage(api, database, router, storage) {
        this.api = api;
        this.database = database;
        this.router = router;
        this.storage = storage;
        this.months = { 0: "JAN", 1: "FEB", 2: "MAR", 3: "APR", 4: "MAY", 5: "JUN",
            6: "JUL", 7: "AUG", 8: "SEP", 9: "OCT", 10: "NOV", 11: "DEC" };
    }
    PostReadingPage.prototype.ngOnInit = function () {
        this.now = moment().format('YYYY-MM-DD') + ' 00:00:00';
        this.todayStr = this.getTodaysDateAsStr();
        this.getReadingInfo();
        this.getTreatmentDetails();
    };
    PostReadingPage.prototype.syncEHR = function () {
        var _this = this;
        this.storage.get("Connection")
            .then(function (val) {
            console.log("val pulled from storage 3 on post page: Connection= ", val);
            if (val == 1) {
                _this.api.dropJSON();
            }
            else {
                console.log("No connection, don't try");
            }
        });
    };
    PostReadingPage.prototype.ionViewWillEnter = function () {
        this.ngOnInit();
    };
    PostReadingPage.prototype.getTodaysDateAsStr = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = moment().month();
        var mmstr = this.months[mm];
        console.log('month first:', mm);
        console.log('month1:', mmstr);
        var todaysDateAsStr = mmstr.toUpperCase() + ' ' + dd;
        console.log('month3:', mmstr);
        return todaysDateAsStr;
    };
    PostReadingPage.prototype.displayMedsTaken = function () {
        document.getElementById("conConfirmMeds").style.display = "none";
        document.getElementById("conCancelMeds").style.display = "";
    };
    PostReadingPage.prototype.displayMedsNotTaken = function () {
        document.getElementById("conConfirmMeds").style.display = "";
        document.getElementById("conCancelMeds").style.display = "none";
    };
    PostReadingPage.prototype.confirmMedsTaken = function () {
        var _this = this;
        var query = "UPDATE daily_readings SET medication_taken = 1 WHERE date_of_reading = '" + this.now + "';";
        this.database.doQuery(query).then(function (data) {
            console.log(query);
            _this.displayMedsTaken();
            _this.medTaken = 1;
        });
    };
    PostReadingPage.prototype.cancelMedsTaken = function () {
        var _this = this;
        var query = "UPDATE daily_readings SET medication_taken = 0 WHERE date_of_reading = '" + this.now + "';";
        this.database.doQuery(query).then(function (data) {
            console.log(query);
            _this.displayMedsNotTaken();
            _this.medTaken = 0;
        });
    };
    PostReadingPage.prototype.getReadingInfo = function () {
        var _this = this;
        var query = "SELECT * FROM daily_readings WHERE date_of_reading = '" + this.now + "';";
        this.database.doQuery(query).then(function (data) {
            console.log("postreading data = ");
            console.log(data);
            _this.reading = data[1]["reading_level_id"];
            console.log("reading = " + _this.reading);
            // get reading info
            if (_this.reading == 1) {
                _this.readingSquareIcon = "neg-sq";
                _this.readingDesc = "Negative";
            }
            else if (_this.reading == 2) {
                _this.readingSquareIcon = "trace-sq";
                _this.readingDesc = "Trace";
            }
            else if (_this.reading == 3) {
                _this.readingSquareIcon = "oneplus-sq";
                _this.readingDesc = "30mg/dL";
            }
            else if (_this.reading == 4) {
                _this.readingSquareIcon = "twoplus-sq";
                _this.readingDesc = "100mg/dL";
            }
            else if (_this.reading == 5) {
                _this.readingSquareIcon = "threeplus-sq";
                _this.readingDesc = "300mg/dL";
            }
            else if (_this.reading == 6) {
                _this.readingSquareIcon = "fourplus-sq";
                _this.readingDesc = "2000mg/dL +";
            }
            else {
                console.log(_this.reading + "is not a number between 1 and 6");
            }
            console.log("readingSqIcon = " + _this.readingSquareIcon);
            // get meds info
            _this.medTaken = data[1]["medication_taken"];
            console.log("medstaken = " + _this.medTaken);
            if (_this.medTaken == 0) {
                _this.displayMedsNotTaken();
                console.log('displayMeds0');
            }
            else if (_this.medTaken == 1) {
                _this.displayMedsTaken();
                console.log('displayMeds1');
            }
            // get comment
            _this.comment = data[1]["user_comment"];
            console.log("user comment = " + _this.comment);
            if (!_this.comment) {
                _this.comment = "None";
            }
        });
    };
    PostReadingPage.prototype.editReading = function () {
        var _this = this;
        var query = "DELETE FROM daily_readings WHERE date_of_reading = '" + this.now + "'";
        console.log(query);
        // let query = "DELETE FROM daily_readings WHERE date_of_reading = date('now')";
        this.database.doQuery(query)
            .then(function (data) {
            _this.storage.get("origStateObj");
        })
            .then(function (val) {
            console.log("val pulled from storage below:");
            console.log(val);
            _this.orig_state = val["orig_state"];
            _this.orig_start_date = val["orig_start_date"];
        })
            .then(function (data) {
            _this.database.updateActiveTreatmentState(_this.orig_state, _this.orig_start_date);
        })
            .then(function (data) {
            _this.router.navigate(['tabs/tab2/pre-reading']);
        });
    };
    PostReadingPage.prototype.getTreatmentDetails = function () {
        var _this = this;
        this.storage.get("new_state_obj")
            .then(function (val) {
            console.log("val pulled from storage below:");
            console.log(val);
            _this.new_state = val["new_state"];
            _this.new_start_date = val["new_start_date"];
        });
        this.database.doQuery("SELECT * FROM active_treatment_state")
            .then(function (val1) {
            console.log(val1);
            _this.active_state_id = val1[1]["active_treatment_state_id"];
        })
            .then(function (val) {
            var query = "SELECT * FROM treatment_state WHERE treatment_state_id = " + _this.new_state;
            console.log(query);
            _this.database.doQuery(query).then(function (result) {
                console.log(result);
                _this.treatmentDetails = result[1];
            }).then(function (val) {
                _this.dosesPerInterval = _this.treatmentDetails["doses_per_interval"];
                _this.reccDose = _this.treatmentDetails["recc_dose"];
                _this.stateName = _this.treatmentDetails["state_name"];
                _this.intervalLen = _this.treatmentDetails["interval_length"];
            });
        });
    };
    PostReadingPage = tslib_1.__decorate([
        Component({
            selector: 'app-post-reading',
            templateUrl: './post-reading.page.html',
            styleUrls: ['./post-reading.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ApiService, DatabaseService, Router, Storage])
    ], PostReadingPage);
    return PostReadingPage;
}());
export { PostReadingPage };
//# sourceMappingURL=post-reading.page.js.map