import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { FetchReadingService } from '../../services/fetch-reading.service';
var ConfirmReadingPage = /** @class */ (function () {
    function ConfirmReadingPage(route, database, router, storage, fetchReading, api) {
        this.route = route;
        this.database = database;
        this.router = router;
        this.storage = storage;
        this.fetchReading = fetchReading;
        this.api = api;
        this.state_code = { 'Maintenance': 'at0002', 'Remission': "at0003", 'Relapse': 'at0004' };
        this.protein_code = { 1: 'at0096', 2: "at0097", 3: 'at0098', 4: 'at0099', 5: "at0100", 6: 'at0101' };
        this.protein_level = { 1: 'Negative', 2: "Trace", 3: '1+', 4: '2+', 5: "3+", 6: '4+' };
    }
    ConfirmReadingPage.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.reading = params['reading'];
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
    };
    ConfirmReadingPage.prototype.ionViewWillEnter = function () {
        this.ngOnInit();
    };
    ConfirmReadingPage.prototype.getMedicationNumber = function (medTaken) {
        if (medTaken) {
            return 1;
        }
        else {
            return 0;
        }
    };
    ConfirmReadingPage.prototype.addReadingToDB = function () {
        var _this = this;
        // get readingLevel
        this.readingLevelStr = document.getElementById("readingLevel").getAttribute("value");
        console.log(this.readingLevelStr);
        // get comment
        // this.commentStr = document.getElementById("comment").getAttribute("value");
        this.commentStr = this.user_comment;
        if (this.commentStr == null || this.commentStr == "") {
            this.commentStr = "None";
        }
        console.log('comment = ' + this.user_comment);
        this.todaysReadingObj = {
            "reading_level_id": this.readingLevel,
            "medication_taken": this.medTaken,
            "user_comment": this.commentStr,
            "treatment_state_id": this.new_state,
        };
        this.database.insertData(this.todaysReadingObj, "daily_readingsReal")
            .then(function (data) {
            _this.updateNewState();
        })
            .catch(function (error) {
            console.log(error);
            console.log(error.stringify());
        });
    };
    ConfirmReadingPage.prototype.confirmMedsTaken = function () {
        document.getElementById("confirmMeds").style.display = "none";
        document.getElementById("cancelMeds").style.display = "";
        this.medTaken = 1;
        console.log('confirmMedsTaken = ');
        console.log(this.medTaken);
    };
    ConfirmReadingPage.prototype.cancelMedsTaken = function () {
        document.getElementById("confirmMeds").style.display = "";
        document.getElementById("cancelMeds").style.display = "none";
        this.medTaken = 0;
        console.log('confirmMedsTaken = ');
        console.log(this.medTaken);
    };
    ConfirmReadingPage.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    ConfirmReadingPage.prototype.getNextStateDetails = function () {
        var _this = this;
        this.storage.get("new_state_obj")
            .then(function (val) {
            console.log("val pulled from storage below:");
            console.log(val);
            _this.new_state = val["new_state"];
            _this.new_start_date = val["new_start_date"];
        })
            .then(function (val) {
            var query = "SELECT * FROM treatment_state WHERE treatment_state_id = " + _this.new_state + ";";
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
        })
            .then(function (val) {
            _this.storage.set("treatmentDetails", _this.treatmentDetails);
        });
    };
    ConfirmReadingPage.prototype.updateNewState = function () {
        var _this = this;
        this.database.updateActiveTreatmentState(this.new_state, this.new_start_date)
            .then(function (data) {
            console.log("Updating Active State with " + _this.new_state + " and " + _this.new_start_date);
        })
            .catch(function (error) {
            console.log(error.stringify());
        });
        this.dailyReadingPrep();
    };
    ConfirmReadingPage.prototype.goBack = function () {
        this.router.navigateByUrl('tabs/tab2/input-reading');
    };
    ConfirmReadingPage.prototype.dailyReadingPrep = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.now = moment().format('YYYY-MM-DDTHH:mm:ss');
            _this.fetchReading.myProfileDetails()
                .then(function (data) {
                var existingData = Object.keys(data).length;
                if (existingData !== 0) {
                    _this.myName = String(data[0].name);
                    _this.ehrId = String(data[0].ehrid);
                }
                _this.stateName = _this.stateName.charAt(0).toUpperCase() + _this.stateName.slice(1);
                console.log("my details from db", _this.myName);
                console.log("my details from db2", _this.ehrId);
                _this.regime = String(_this.stateName) + ' regime';
                _this.status_code = _this.state_code[_this.stateName];
                _this.protein = _this.protein_code[_this.readingLevel];
                _this.level = _this.protein_level[_this.readingLevel];
                _this.dailyDose = (_this.reccDose * _this.dosesPerInterval) / _this.intervalLen;
                _this.checkConsent();
            });
        });
    };
    ConfirmReadingPage.prototype.checkConsent = function () {
        var _this = this;
        this.storage.get("EHR")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 0) {
                console.log('No consent- just local storage');
                _this.router.navigate(['tabs/tab2/post-reading']);
            }
            else {
                console.log('ehrID exists so they consent');
                _this.sendDailyReading();
            }
        });
    };
    ConfirmReadingPage.prototype.sendDailyReading = function () {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('time:', _this.now);
            console.log('name:', _this.myName);
            console.log('ehrid:', _this.ehrId);
            console.log('protein code:', _this.protein);
            console.log('protein level:', _this.level);
            console.log('protein ordinal', _this.readingLevel);
            console.log('status code:', _this.status_code);
            console.log('status value:', _this.stateName);
            console.log('reason:', _this.regime);
            console.log('comment:', _this.user_comment);
            console.log('dose mag:', _this.reccDose);
            console.log('dose unit:', _this.dosesPerInterval);
            _this.dailyReading = {
                "ctx/language": "en",
                "ctx/territory": "GB",
                "ctx/time": _this.now,
                "ctx/composer_name": _this.myName,
                "ctx/id_namespace": "NHS-APP",
                "ctx/id_scheme": "NHS-APP",
                "ctx/health_care_facility|name": "Home",
                "ctx/health_care_facility|id": "000",
                "nephrotic_syndrome_self_monitoring/urinalysis/protein|code": _this.protein,
                "nephrotic_syndrome_self_monitoring/urinalysis/protein|value": _this.level,
                "nephrotic_syndrome_self_monitoring/urinalysis/protein|ordinal": _this.readingLevel,
                "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|value": "Nephrotic syndrome",
                "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|code": "52254009",
                "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|terminology": "SNOMED-CT",
                "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/nephrotic_syndrome_status/status|code": _this.status_code,
                "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/nephrotic_syndrome_status/status|value": _this.stateName,
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/current_state|code": "245",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/current_state|value": "active",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/careflow_step|code": "at0006",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/careflow_step|value": "Dose administered",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|value": "Prednisolone",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|code": "52388000",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|terminology": "SNOMED-CT",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/reason": _this.regime,
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/comment": _this.user_comment,
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_amount|magnitude": _this.dailyDose,
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_amount|unit": "1",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|code": "mg",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|value": "mg",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|terminology": "UCUM",
                "nephrotic_syndrome_self_monitoring/daily_dose_administered/time": _this.now
            };
            console.log('body:', _this.dailyReading);
            _this.checkConnection();
            //   this.api.commitComposition(this.ehrId, this.myName, this.dailyReading)
            //   .then(() => {
            //     console.log('Get connection...');
            //     return this.routeComp(dailyReading)
            //   })
            //   resolve()
            // });
        });
    };
    ConfirmReadingPage.prototype.checkConnection = function () {
        var _this = this;
        console.log("Checking Connection flag....");
        this.api.getTemplates()
            .then(function () {
            return _this.continueCheck();
        });
    };
    // async routeComp(dailyReading){
    //   await this.storage.get("Connection")
    //     .then((val) => {
    //       console.log("value pulled from storage 2: ",val);
    //       if (val == 0){
    //         this.api.storeReading(dailyReading)
    //         this.router.navigate(['tabs/tab2/post-reading']);
    //       }
    //       else{
    //         console.log("did that work?? Connection is good");
    //         this.router.navigate(['tabs/tab2/post-reading']);
    //       }
    //   });
    // }
    ConfirmReadingPage.prototype.continueCheck = function () {
        var _this = this;
        this.storage.get("Connection")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 1) {
                _this.api.commitComposition(_this.ehrId, _this.myName, _this.dailyReading)
                    .then(function () {
                    _this.router.navigate(['tabs/tab2/post-reading']);
                });
            }
            else {
                console.log("did that work?");
                _this.api.storeReading(_this.dailyReading)
                    .then(function () {
                    _this.router.navigate(['tabs/tab2/post-reading']);
                });
            }
        });
    };
    ConfirmReadingPage = tslib_1.__decorate([
        Component({
            selector: 'app-confirm-reading',
            templateUrl: './confirm-reading.page.html',
            styleUrls: ['./confirm-reading.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            DatabaseService,
            Router,
            Storage,
            FetchReadingService,
            ApiService])
    ], ConfirmReadingPage);
    return ConfirmReadingPage;
}());
export { ConfirmReadingPage };
//# sourceMappingURL=confirm-reading.page.js.map