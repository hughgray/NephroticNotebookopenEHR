import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { FetchReadingService } from '../../services/fetch-reading.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ActionSheetController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
var EditPage = /** @class */ (function () {
    function EditPage(alertController, storage, api, actionSheetController, router, formBuilder, database, fetchReading) {
        this.alertController = alertController;
        this.storage = storage;
        this.api = api;
        this.actionSheetController = actionSheetController;
        this.router = router;
        this.formBuilder = formBuilder;
        this.database = database;
        this.fetchReading = fetchReading;
        this.maintenanceDuration = 99999999;
        this.relapseDuration = 99999999;
        this.treatmentplan = [];
        this.treatmentPlanCdr = [];
        this.error_messages = {
            'doctorsName': [
                { type: 'required', message: 'You must enter your Clinician\'s name to update.' }
            ],
            'docID': [
                { type: 'required', message: 'This ID must be 7 digits long!' },
                { type: 'pattern', message: 'This ID must be 7 digits long!' }
            ],
            'maintenanceDose': [
                { type: 'required', message: 'These are all required. Enter "0" if none.' }
            ],
            'relapseAmount': [
                { type: 'required', message: 'These are all required. Enter "0" if none.' }
            ],
            'remissionAmount': [
                { type: 'required', message: 'These are all required. Enter "0" if none.' }
            ]
        };
        this.treatmentForm = this.formBuilder.group({
            maintenanceDose: new FormControl('', Validators.compose([
                Validators.required
            ])),
            maintenanceTimes: new FormControl('', Validators.compose([
                Validators.required
            ])),
            maintenanceInterval: new FormControl('', Validators.compose([
                Validators.required
            ])),
            relapseAmount: new FormControl('', Validators.compose([
                Validators.required
            ])),
            relapseTimes: new FormControl('', Validators.compose([
                Validators.required
            ])),
            relapseInterval: new FormControl('', Validators.compose([
                Validators.required
            ])),
            remissionAmount: new FormControl('', Validators.compose([
                Validators.required
            ])),
            remissionDuration: new FormControl('', Validators.compose([
                Validators.required
            ])),
            remissionTimes: new FormControl('', Validators.compose([
                Validators.required
            ])),
            remissionInterval: new FormControl('', Validators.compose([
                Validators.required
            ])),
            moreRemissionAmount: new FormArray([]),
            moreRemissionDuration: new FormArray([]),
            moreRemissionTimes: new FormArray([]),
            moreRemissionInterval: new FormArray([]),
            doctorsName: new FormControl('', Validators.compose([
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
            ]))
        });
    }
    EditPage.prototype.addRemissionAmount = function () {
        this.treatmentForm.get('moreRemissionAmount').push(new FormControl(''));
    };
    EditPage.prototype.removeRemissionAmount = function (index) {
        this.treatmentForm.get('moreRemissionAmount').removeAt(index);
    };
    EditPage.prototype.addRemissionDuration = function () {
        this.treatmentForm.get('moreRemissionDuration').push(new FormControl(''));
    };
    EditPage.prototype.removeRemissionDuration = function (index) {
        this.treatmentForm.get('moreRemissionDuration').removeAt(index);
    };
    EditPage.prototype.addRemissionTimes = function () {
        this.treatmentForm.get('moreRemissionTimes').push(new FormControl(''));
    };
    EditPage.prototype.removeRemissionTimes = function (index) {
        this.treatmentForm.get('moreRemissionTimes').removeAt(index);
    };
    EditPage.prototype.addRemissionInterval = function () {
        this.treatmentForm.get('moreRemissionInterval').push(new FormControl(''));
    };
    EditPage.prototype.removeRemissionInterval = function (index) {
        this.treatmentForm.get('moreRemissionInterval').removeAt(index);
    };
    EditPage.prototype.ngOnInit = function () {
        var _this = this;
        this.fetchReading
            .treatmentPlanID()
            .then(function (data) {
            _this.planId = data;
            console.log("id from db come on 4", _this.planId[0].planId);
            _this.planId = ((_this.planId[0].planId) + 1);
            _this.newPlanId = _this.planId;
            console.log("single #", _this.planId);
        });
        this.fetchReading
            .activeTreatmentPlanID()
            .then(function (data) {
            _this.stateId = data;
            console.log("id from db come on 4", _this.stateId[0].activeStateId);
            _this.stateId = _this.stateId[0].activeStateId;
        });
        this.fetchReading.myProfileDetails()
            .then(function (data) {
            var existingData = Object.keys(data).length;
            if (existingData !== 0) {
                _this.docName = String(data[0].doc);
                _this.ehrId = String(data[0].ehrid);
            }
        });
        this.storage.set("Connection", 0);
        console.log('Connection set to 0');
    };
    EditPage.prototype.presentActionSheet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var actionSheet;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetController.create({
                            header: 'What state are you currently in?',
                            buttons: [{
                                    text: 'Maintenance',
                                    handler: function () {
                                        console.log('Maintenance selected');
                                        _this.currentState = 1;
                                        _this.treatmentPlan();
                                    }
                                }, {
                                    text: 'Relapse',
                                    handler: function () {
                                        console.log('Relapse selected');
                                        _this.currentState = 2;
                                        _this.treatmentPlan();
                                    }
                                }, {
                                    text: 'Remission',
                                    handler: function () {
                                        console.log('Remission selected');
                                        _this.currentState = 3;
                                        _this.treatmentPlan();
                                    }
                                }]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditPage.prototype.treatmentPlan = function () {
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
        console.log("Amount ", this.treatmentForm.value.moreRemissionAmount);
        console.log("Duration ", this.treatmentForm.value.moreRemissionDuration);
        console.log("Times ", this.treatmentForm.value.moreRemissionTimes);
        console.log("Interval ", this.treatmentForm.value.moreRemissionInterval);
        console.log("Amount ", Amount);
        console.log("Duration ", Duration);
        console.log("Times ", Times);
        console.log("Interval ", Interval);
        this.treatmentplan = [maintenance, relapse, remission];
        for (var i = 0; i < Amount.length; i++) {
            this.treatmentplan.push(window['remission' + i] = ["remission" + i, Duration[i], Amount[i], Times[i], Interval[i]]);
            this.treatmentPlanCdr.push(window['remission' + i] = ["remission" + i, Duration[i], Amount[i], Times[i], Interval[i]]);
        }
        ;
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
        console.log('Maintenance: ', maintenance);
        console.log('Relapse: ', relapse);
        console.log('Remission', remission);
        console.log('TreatmentPlan Array: ', this.treatmentplan);
        console.log('TreatmentPlan Array: ', this.treatmentplan[0][1]);
        console.log('TreatmentPlan cdr: ', this.treatmentPlanCdr[0][1]);
        console.log('TreatmentPlan cdr: ', this.treatmentPlanCdr[0][2]);
        console.log('Current State: ', this.currentState);
        this.checkConsent();
    };
    EditPage.prototype.localOnly = function () {
        var _this = this;
        for (var i = 0; i < this.treatmentplan.length; i++) {
            var treatment = [];
            treatment = [
                this.newPlanId,
                this.treatmentplan[i][0],
                this.treatmentplan[i][1],
                this.treatmentplan[i][2],
                this.treatmentplan[i][3],
                this.treatmentplan[i][4],
            ];
            this.database.insertData(treatment, "treatment_stateReal");
            console.log('Treatment: ', treatment);
            console.log("single #", this.newPlanId);
        }
        var now = moment().format('YYYY-MM-DD') + ' 00:00:00';
        console.log('Date: ', now);
        var newActiveState = this.stateId + this.currentState;
        console.log('State New: ', newActiveState);
        this.database.updateActiveTreatmentState(newActiveState, now)
            .then(function () {
            _this.router.navigateByUrl('/tabs/tab3');
        });
    };
    EditPage.prototype.goBack = function () {
        this.router.navigateByUrl('tabs/tab3/mytreatmentplan');
    };
    EditPage.prototype.dailyReadingPrep = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.remissionDurIso = "P" + _this.treatmentForm.value.remissionDuration + "D";
            _this.now = moment().format('YYYY-MM-DD') + ' 00:00:00';
            _this.nowT = moment().format('YYYY-MM-DDThh:mm:ssZ');
            console.log('Time: ', _this.nowT);
            _this.fetchReading.myProfileDetails()
                .then(function (data) {
                var existingData = Object.keys(data).length;
                if (existingData !== 0) {
                    _this.docName = String(data[0].doc);
                    _this.docNumber = String(data[0].num);
                    _this.docID = String(data[0].docId);
                    _this.typeID = String(data[0].idType);
                    _this.ehrId = String(data[0].ehrid);
                }
                _this.prepTreatmentPlan();
            });
        });
    };
    EditPage.prototype.checkConsent = function () {
        var _this = this;
        this.storage.get("EHR")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 0) {
                console.log('No consent- just local storage');
                var myDoc = {
                    "doctor_name": _this.treatmentForm.value.doctorsName,
                };
                _this.database.insertData(myDoc, "profileDoc")
                    .then(function () {
                    _this.localOnly();
                });
            }
            else {
                console.log("ehrID exists so they consent");
                _this.api.getTemplates()
                    .then(function () {
                    _this.checkConnection();
                });
            }
        });
    };
    EditPage.prototype.checkConnection = function () {
        var _this = this;
        this.storage.get("Connection")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 0) {
                _this.noNetworkConnection();
            }
            else {
                console.log("Connection is g! Did that work?");
                _this.dailyReadingPrep();
            }
        });
    };
    EditPage.prototype.noNetworkConnection = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'CONNECTION ERROR',
                            message: 'You must be able to connect to the CDR in order to change your Treatment Plan. Please check your internet connection and restart the app.',
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
    EditPage.prototype.prepTreatmentPlan = function () {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('time:', _this.now);
            console.log('name:', _this.docName);
            console.log('num:', _this.docNumber);
            console.log('ID:', _this.docID);
            console.log('ID type:', _this.typeID);
            console.log('ehrid:', _this.ehrId);
            _this.treatmentPlanEHR = {
                "ctx/language": "en",
                "ctx/territory": "GB",
                "ctx/composer_name": _this.docName,
                "ctx/composer_id": _this.docID,
                "ctx/id_namespace": "HOSPITAL-NS",
                "ctx/id_scheme": "HOSPITAL-NS",
                "ctx/health_care_facility|name": "Hospital",
                "ctx/health_care_facility|id": "9091",
                "nephrotic_syndrome_treatment_plan/composer|id": _this.docID,
                "nephrotic_syndrome_treatment_plan/composer|id_scheme": "GMC",
                "nephrotic_syndrome_treatment_plan/composer|id_namespace": _this.typeID + "Number",
                "nephrotic_syndrome_treatment_plan/composer|name": _this.treatmentForm.value.doctorsName,
                "nephrotic_syndrome_treatment_plan/care_team/name": "Nephrotic syndrome team",
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/role": "Lead clinician",
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value": _this.docID,
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|issuer": _this.typeID,
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|assigner": _this.typeID,
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|type": _this.typeID + "number",
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/use|code": "at0002",
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/text": _this.docName,
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/system|code": "at0012",
                "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/value": _this.docNumber,
                "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/current_state|code": "245",
                "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/careflow_step|code": "at0015",
                "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/careflow_step|value": "Informed Consent Provided",
                "nephrotic_syndrome_treatment_plan/informed_consent/consent_name": "Consent to Treatment plan and sharing information to EHR",
                "nephrotic_syndrome_treatment_plan/informed_consent/time": _this.nowT,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/medication_item|code": "52388000",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/medication_item|value": "Product containing prednisolone",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/medication_item|terminology": "SNOMED-CT",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/clinical_indication:0": "Nephrotic syndrome Maintenance",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/direction_sequence": 1,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/direction_duration/coded_text_value|code": "at0067",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/dosage/dose_amount|magnitude": _this.treatmentForm.value.maintenanceDose,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": _this.treatmentForm.value.maintenanceTimes,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:0/repetition_timing/interval": "P" + _this.treatmentForm.value.maintenanceInterval + "D",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/clinical_indication:1": "Nephrotic syndrome Relapse",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/direction_sequence": 2,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/direction_duration/coded_text_value|code": "at0067",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/dosage/dose_amount|magnitude": _this.treatmentForm.value.relapseAmount,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/dosage/dose_amount|unit": "1",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/dosage/dose_unit|code": "mg",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/dosage/dose_unit|value": "mg",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/dosage/daily_timing/frequency|magnitude": _this.treatmentForm.value.relapseTimes,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/dosage/daily_timing/frequency|unit": "1/d",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/dosage/dose_unit|terminology": "UCUM",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:1/repetition_timing/interval": "P" + _this.treatmentForm.value.relapseInterval + "D",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/clinical_indication:2": "Nephrotic syndrome Remission",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/direction_sequence": 3,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/direction_duration/duration_value": _this.remissionDurIso,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/dosage/dose_amount|magnitude": _this.treatmentForm.value.remissionAmount,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/dosage/dose_amount|unit": "1",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/dosage/dose_unit|code": "mg",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/dosage/dose_unit|value": "mg",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/dosage/daily_timing/frequency|magnitude": _this.treatmentForm.value.remissionTimes,
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/dosage/daily_timing/frequency|unit": "1/d",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/dosage/dose_unit|terminology": "UCUM",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:2/repetition_timing/interval": "P" + _this.treatmentForm.value.remissionInterval + "D",
                "nephrotic_syndrome_treatment_plan/treatment_plan/order/timing": _this.now,
                "nephrotic_syndrome_treatment_plan/treatment_plan/expiry_time": "2099-01-01T00:00:00.00Z",
                "nephrotic_syndrome_treatment_plan/treatment_plan/narrative": "Human readable instruction narrative"
            };
            for (var i = 3; i < _this.treatmentPlanCdr.length + 3; i++) {
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/clinical_indication:" + i] = "Nephrotic syndrome Remission";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/direction_sequence"] = i + 1;
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/direction_duration/duration_value"] = "P" + _this.treatmentPlanCdr[i - 3][1] + "D";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/dosage/dose_amount|magnitude"] = _this.treatmentPlanCdr[i - 3][2];
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/dosage/dose_amount|unit"] = "1";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/dosage/dose_unit|code"] = "mg";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/dosage/dose_unit|value"] = "mg";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/dosage/daily_timing/frequency|magnitude"] = _this.treatmentPlanCdr[i - 3][3];
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/dosage/daily_timing/frequency|unit"] = "1/d";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/dosage/dose_unit|terminology"] = "UCUM";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/treatment_plan/order/therapeutic_direction:" + i + "/repetition_timing/interval"] = "P" + _this.treatmentPlanCdr[i - 3][4] + "D";
            }
            ;
            console.log('body:', JSON.stringify(_this.treatmentPlanEHR));
            resolve();
            _this.getPlanUid();
        });
    };
    EditPage.prototype.getPlanUid = function () {
        var _this = this;
        this.fetchReading.treatmentDetails()
            .then(function (data) {
            var existingData = Object.keys(data).length;
            if (existingData !== 0) {
                _this.uid = String(data[0].planUid);
            }
            console.log('Plan Uid: ', _this.uid);
            _this.sendTreatmentPlan();
        });
    };
    EditPage.prototype.sendTreatmentPlan = function () {
        var _this = this;
        var myDoc = {
            "doctor_name": this.treatmentForm.value.doctorsName,
        };
        this.database.insertData(myDoc, "profileDoc");
        this.api.commitNewTreatmentPlan(this.uid, this.treatmentPlanEHR)
            .then(function () {
            // deal with failure of plan submission here- catch error
            console.log('New Plan Sent');
            _this.localOnly();
        });
    };
    EditPage = tslib_1.__decorate([
        Component({
            selector: 'app-edit',
            templateUrl: './edit.page.html',
            styleUrls: ['./edit.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController, Storage, ApiService, ActionSheetController, Router, FormBuilder, DatabaseService, FetchReadingService])
    ], EditPage);
    return EditPage;
}());
export { EditPage };
//# sourceMappingURL=edit.page.js.map