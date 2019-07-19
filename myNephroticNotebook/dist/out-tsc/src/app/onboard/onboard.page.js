import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
var OnboardPage = /** @class */ (function () {
    function OnboardPage(storage, network, alertController, api, router, formBuilder, database, platform) {
        this.storage = storage;
        this.network = network;
        this.alertController = alertController;
        this.api = api;
        this.router = router;
        this.formBuilder = formBuilder;
        this.database = database;
        this.platform = platform;
        this.consent = false;
        this.error_messages = {
            'myName': [
                { type: 'required', message: 'Your name is needed!.' }
            ],
            'myNHSno': [
                { type: 'required', message: 'Your NHS number is needed!.' },
                { type: 'pattern', message: 'Your NHS number must be 10 digits long!' }
            ],
            'myDoctor': [
                { type: 'required', message: 'Your doctor\'s name is needed!.' }
            ],
            'myDoctorsNumber': [
                { type: 'required', message: 'A number is needed!.' }
            ],
            'myDocID': [
                { type: 'required', message: 'Your clinician\'s ID is needed!' }
            ],
            'myBirthday': [
                { type: 'required', message: 'Please tell us your birthday :).' }
            ],
            'cdrProvider': [
                { type: 'required', message: 'Please choose a CDR provider or select None.' }
            ],
            'docID': [
                { type: 'required', message: 'This ID must be 7 digits long!' },
                { type: 'pattern', message: 'This ID must be 7 digits long!' }
            ]
        };
        this.profileForm = this.formBuilder.group({
            myName: new FormControl('', Validators.compose([
                Validators.required
            ])),
            myNHSno: new FormControl('', Validators.compose([
                Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.required
            ])),
            myDoctor: new FormControl('', Validators.compose([
                Validators.required
            ])),
            myDoctorsNumber: new FormControl('', Validators.compose([
                Validators.required
            ])),
            myBirthday: new FormControl('', Validators.compose([
                Validators.required
            ])),
            docID: new FormControl('', Validators.compose([
                Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
                Validators.minLength(7),
                Validators.maxLength(7),
                Validators.required
            ])),
            docType: new FormControl('', Validators.compose([
                Validators.required
            ])),
            cdrProvider: new FormControl('', Validators.compose([
                Validators.required
            ]))
        });
    }
    OnboardPage.prototype.noNetworkConnection = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'CONNECTION ERROR',
                            message: 'You must be able to connect to the CDR in order to continue with onboarding. Please check your internet connection and CDR provider.',
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OnboardPage.prototype.noCdrChosen = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Must choose a CDR',
                            message: 'In order to store your data in your EHR you must select your CDR provider.',
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OnboardPage.prototype.ngOnInit = function () {
        this.storage.set("Connection", 1);
        console.log("consent flag", this.consent);
        this.storage.set("EHR", 0);
        console.log("EHR flag: 0");
        this.presentAlertConfirm();
    };
    OnboardPage.prototype.presentAlertConfirm = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            message: 'Do you consent to the storage and usage of your data in your personal EHR to be used for medical and/or research purposes?',
                            buttons: [
                                {
                                    text: 'No',
                                    role: 'no',
                                    cssClass: 'secondary',
                                    handler: function (blah) {
                                        console.log('Consent to EHR? No');
                                        _this.presentAlertConfirmNo();
                                    }
                                }, {
                                    text: 'Yes',
                                    handler: function () {
                                        console.log('Consent to EHR? Yes');
                                        _this.consent = true;
                                        console.log("consent flag", _this.consent);
                                        _this.storage.set("EHR", 1);
                                        console.log("EHR flag set to 1");
                                    }
                                }
                            ],
                            backdropDismiss: false
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OnboardPage.prototype.presentAlertConfirmNo = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            message: 'Are you sure? Please note that if you do not consent you will not be able to alter this decision in future.',
                            buttons: [
                                {
                                    text: 'No',
                                    role: 'no',
                                    cssClass: 'secondary',
                                    handler: function (blah) {
                                        console.log('Confirm no consent? No');
                                        _this.presentAlertConfirm();
                                    }
                                }, {
                                    text: 'Yes',
                                    handler: function () {
                                        console.log('Confirm no consent? Yes');
                                        _this.consent = false;
                                        console.log("consent flag", _this.consent);
                                    }
                                }
                            ],
                            backdropDismiss: false
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OnboardPage.prototype.checkConnection = function () {
        var _this = this;
        console.log("Checking Connection flag....");
        if (this.consent == true && this.profileForm.value.cdrProvider == 'None') {
            this.noCdrChosen();
        }
        else if (this.consent == true) {
            this.storage.set("CDR", this.profileForm.value.cdrProvider)
                .then(function () {
                _this.api.setCDRVariables()
                    .then(function () {
                    _this.api.getTemplates()
                        .then(function () {
                        return _this.continueCheck();
                    });
                });
            });
        }
        else {
            this.addToDB();
        }
    };
    OnboardPage.prototype.continueCheck = function () {
        var _this = this;
        this.storage.get("Connection")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 0) {
                _this.noNetworkConnection();
            }
            else {
                console.log("did that work?");
                _this.ehrPlay();
            }
        });
    };
    OnboardPage.prototype.mydetails = function () {
        console.log('Name: ', this.profileForm.value.myName);
        console.log('NHS no: ', this.profileForm.value.myNHSno);
        console.log('Doctor: ', this.profileForm.value.myDoctor);
        console.log('Doctors #: ', this.profileForm.value.myDoctorsNumber);
        console.log('ID: ', this.profileForm.value.docID);
        console.log('Type: ', this.profileForm.value.docType);
        console.log('CDR: ', this.profileForm.value.cdrProvider);
        console.log('Birthday: ', this.profileForm.value.myBirthday);
        console.log('Other_meds: ', this.others);
    };
    OnboardPage.prototype.addToDB = function () {
        var _this = this;
        var myProfileDetailsBetter = [
            this.profileForm.value.myName,
            this.profileForm.value.myNHSno,
            this.profileForm.value.myBirthday,
            this.profileForm.value.myDoctor,
            this.profileForm.value.myDoctorsNumber,
            this.profileForm.value.docID,
            this.profileForm.value.docType,
            this.profileForm.value.cdrProvider
        ];
        this.database.insertData(myProfileDetailsBetter, "profile");
        console.log('Checker: ', myProfileDetailsBetter);
        var myDoc = {
            "doctor_name": this.profileForm.value.myDoctor,
        };
        this.database.insertData(myDoc, "profileDoc")
            .then(function () {
            if (_this.consent == true) {
                _this.api.addToDB();
                _this.router.navigateByUrl('/onboardtreatmentplan');
            }
            else {
                _this.router.navigateByUrl('/onboardtreatmentplan');
            }
        });
    };
    OnboardPage.prototype.ehrPlay = function () {
        var _this = this;
        this.api.getEHRstatus(this.profileForm.value.myNHSno)
            .then(function (data) {
            if (data == 'error') {
                _this.noNetworkConnection;
            }
            else {
                _this.addToDB();
            }
        });
    };
    OnboardPage.prototype.dummyData = function () {
        var dailyReading = {
            "ctx/language": "en",
            "ctx/territory": "GB",
            "ctx/time": "2019-06-02T16:17:17.122Z",
            "ctx/composer_name": "Silvia Blake",
            "ctx/id_namespace": "NHS-APP",
            "ctx/id_scheme": "NHS-APP",
            "ctx/health_care_facility|name": "Home",
            "ctx/health_care_facility|id": "000",
            "nephrotic_syndrome_self_monitoring/urinalysis/protein|code": "at0098",
            "nephrotic_syndrome_self_monitoring/urinalysis/protein|value": "1+",
            "nephrotic_syndrome_self_monitoring/urinalysis/protein|ordinal": 3,
            "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|value": "Nephrotic syndrome",
            "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|code": "52254009",
            "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/problem_diagnosis_name|terminology": "SNOMED-CT",
            "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/nephrotic_syndrome_status/status|code": "at0004",
            "nephrotic_syndrome_self_monitoring/nephrotic_syndrome_status/nephrotic_syndrome_status/status|value": "Relapse",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/current_state|code": "245",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/current_state|value": "active",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/careflow_step|code": "at0006",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/ism_transition/careflow_step|value": "Dose administered",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|value": "Prednisolone",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|code": "52388000",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/medication_item|terminology": "SNOMED-CT",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/reason": "Relapse regime",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/comment": "Much the same",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_amount|magnitude": 20,
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_amount|unit": "1",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|code": "mg",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|value": "mg",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/dosage/dose_unit|terminology": "UCUM",
            "nephrotic_syndrome_self_monitoring/daily_dose_administered/time": "2019-06-02T16:17:17.122Z"
        };
        this.api.storeReading(dailyReading);
    };
    OnboardPage = tslib_1.__decorate([
        Component({
            selector: 'app-onboard',
            templateUrl: './onboard.page.html',
            styleUrls: ['./onboard.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, Network, AlertController, ApiService, Router, FormBuilder, DatabaseService, Platform])
    ], OnboardPage);
    return OnboardPage;
}());
export { OnboardPage };
//# sourceMappingURL=onboard.page.js.map