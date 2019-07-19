import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';
import { FetchReadingService } from '../services/fetch-reading.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
var OnboardtreatmentplanPage = /** @class */ (function () {
    function OnboardtreatmentplanPage(storage, api, fetchReading, actionSheetController, router, formBuilder, database) {
        this.storage = storage;
        this.api = api;
        this.fetchReading = fetchReading;
        this.actionSheetController = actionSheetController;
        this.router = router;
        this.formBuilder = formBuilder;
        this.database = database;
        this.maintenanceDuration = 99999999;
        this.relapseDuration = 99999999;
        this.treatmentPlanCdr = [];
        this.error_messages = {
            'maintenanceDose': [
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
            moreRemissionInterval: new FormArray([])
        });
    }
    OnboardtreatmentplanPage.prototype.addRemissionAmount = function () {
        this.treatmentForm.get('moreRemissionAmount').push(new FormControl(''));
    };
    OnboardtreatmentplanPage.prototype.removeRemissionAmount = function (index) {
        this.treatmentForm.get('moreRemissionAmount').removeAt(index);
    };
    OnboardtreatmentplanPage.prototype.addRemissionDuration = function () {
        this.treatmentForm.get('moreRemissionDuration').push(new FormControl(''));
    };
    OnboardtreatmentplanPage.prototype.removeRemissionDuration = function (index) {
        this.treatmentForm.get('moreRemissionDuration').removeAt(index);
    };
    OnboardtreatmentplanPage.prototype.addRemissionTimes = function () {
        this.treatmentForm.get('moreRemissionTimes').push(new FormControl(''));
    };
    OnboardtreatmentplanPage.prototype.removeRemissionTimes = function (index) {
        this.treatmentForm.get('moreRemissionTimes').removeAt(index);
    };
    OnboardtreatmentplanPage.prototype.addRemissionInterval = function () {
        this.treatmentForm.get('moreRemissionInterval').push(new FormControl(''));
    };
    OnboardtreatmentplanPage.prototype.removeRemissionInterval = function (index) {
        this.treatmentForm.get('moreRemissionInterval').removeAt(index);
    };
    OnboardtreatmentplanPage.prototype.ngOnInit = function () {
    };
    // backToDetails() {
    //   this.router.navigateByUrl('../onboard');
    // }
    OnboardtreatmentplanPage.prototype.presentActionSheet = function () {
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
                                        _this.treatmentplan();
                                    }
                                }, {
                                    text: 'Relapse',
                                    handler: function () {
                                        console.log('Relapse selected');
                                        _this.currentState = 2;
                                        _this.treatmentplan();
                                    }
                                }, {
                                    text: 'Remission',
                                    handler: function () {
                                        console.log('Remission selected');
                                        _this.currentState = 3;
                                        _this.treatmentplan();
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
    OnboardtreatmentplanPage.prototype.treatmentplan = function () {
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
        var treatmentplan = [maintenance, relapse, remission];
        for (var i = 0; i < Amount.length; i++) {
            treatmentplan.push(window['remission' + i] = ["remission" + i, Duration[i], Amount[i], Times[i], Interval[i]]);
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
        console.log('TreatmentPlan Array: ', treatmentplan);
        console.log('TreatmentPlan Array: ', treatmentplan[0][1]);
        console.log('Current State: ', this.currentState);
        for (var i = 0; i < treatmentplan.length; i++) {
            var treatment = [];
            treatment = [1,
                treatmentplan[i][0],
                treatmentplan[i][1],
                treatmentplan[i][2],
                treatmentplan[i][3],
                treatmentplan[i][4],
            ];
            this.database.insertData(treatment, "treatment_stateReal");
            console.log('Treatment: ', treatment);
        }
        var now = moment().format('YYYY-MM-DD') + ' 00:00:00';
        console.log('Date: ', now);
        var activeState = [
            this.currentState,
            now
        ];
        this.database.insertData(activeState, "active_treatment_state");
        this.checkConsent();
    };
    OnboardtreatmentplanPage.prototype.dailyReadingPrep = function () {
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
    OnboardtreatmentplanPage.prototype.checkConsent = function () {
        var _this = this;
        this.storage.get("EHR")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 0) {
                console.log('No consent- just local storage');
                _this.router.navigateByUrl('/onboardothermeds');
            }
            else {
                console.log("ehrID exists so they consent");
                _this.dailyReadingPrep();
            }
        });
    };
    OnboardtreatmentplanPage.prototype.prepTreatmentPlan = function () {
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
                "nephrotic_syndrome_treatment_plan/composer|id": _this.docID,
                "nephrotic_syndrome_treatment_plan/composer|id_scheme": _this.typeID,
                "nephrotic_syndrome_treatment_plan/composer|id_namespace": _this.typeID + "Number",
                "nephrotic_syndrome_treatment_plan/composer|name": _this.treatmentForm.value.doctorsName,
                "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id": "123456-123",
                "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id_scheme": "ETHERCIS-SCHEME",
                "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id_namespace": "DEMOGRAPHIC",
                "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|name": "FACILITY",
                "nephrotic_syndrome_treatment_plan/event_context/start_time": _this.nowT,
                "nephrotic_syndrome_treatment_plan/event_context/setting|code": "238",
                "nephrotic_syndrome_treatment_plan/event_context/setting|value": "Other Care",
                "nephrotic_syndrome_treatment_plan/event_context/setting|terminology": "openehr",
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
                "nephrotic_syndrome_treatment_plan/language|code": "en",
                "nephrotic_syndrome_treatment_plan/language|terminology": "ISO_639-1",
                "nephrotic_syndrome_treatment_plan/territory|code": "GB",
                "nephrotic_syndrome_treatment_plan/territory|terminology": "ISO_3166-1",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|code": "52388000",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|value": "Product containing prednisolone",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|terminology": "SNOMED-CT",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/clinical_indication:0": "Nephrotic syndrome Maintenance",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/direction_sequence": 1,
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_amount|magnitude": _this.treatmentForm.value.maintenanceDose,
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": _this.treatmentForm.value.maintenanceTimes,
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/repetition_timing/interval": "P" + _this.treatmentForm.value.maintenanceInterval + "D",
                "nephrotic_syndrome_treatment_plan/medication_order:0/order/timing": _this.now,
                // "nephrotic_syndrome_treatment_plan/medication_order:0/expiry_time": "2099-01-01T00:00:00.00Z",
                "nephrotic_syndrome_treatment_plan/medication_order:0/narrative": "Nephrotic syndrome Maintenance",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|code": "52388000",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|value": "Product containing prednisolone",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|terminology": "SNOMED-CT",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/clinical_indication:0": "Nephrotic syndrome Relapse",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/direction_sequence": 2,
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_amount|magnitude": _this.treatmentForm.value.relapseAmount,
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": _this.treatmentForm.value.relapseTimes,
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/repetition_timing/interval": "P" + _this.treatmentForm.value.relapseInterval + "D",
                "nephrotic_syndrome_treatment_plan/medication_order:1/order/timing": _this.now,
                // "nephrotic_syndrome_treatment_plan/medication_order:1/expiry_time": "2099-01-01T00:00:00.00Z",
                "nephrotic_syndrome_treatment_plan/medication_order:1/narrative": "Nephrotic syndrome Relpase",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|code": "52388000",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|value": "Product containing prednisolone",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|terminology": "SNOMED-CT",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/clinical_indication:0": "Nephrotic syndrome Remission",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/direction_sequence": 3,
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/direction_duration": _this.remissionDurIso,
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_amount|magnitude": _this.treatmentForm.value.remissionAmount,
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": _this.treatmentForm.value.remissionTimes,
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/repetition_timing/interval": "P" + _this.treatmentForm.value.remissionInterval + "D",
                "nephrotic_syndrome_treatment_plan/medication_order:2/order/timing": _this.now,
                // "nephrotic_syndrome_treatment_plan/medication_order:2/expiry_time": "2099-01-01T00:00:00.00Z",
                "nephrotic_syndrome_treatment_plan/medication_order:2/narrative": "Human readable instruction narrative"
            };
            for (var i = 3; i < _this.treatmentPlanCdr.length + 3; i++) {
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/clinical_indication:" + i] = "Nephrotic syndrome Remission";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/direction_sequence"] = i + 1;
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/direction_duration"] = "P" + _this.treatmentPlanCdr[i - 3][1] + "D";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/dosage/dose_amount|magnitude"] = _this.treatmentPlanCdr[i - 3][2];
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/dosage/dose_amount|unit"] = "1";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/dosage/dose_unit|code"] = "mg";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/dosage/dose_unit|value"] = "mg";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/dosage/daily_timing/frequency|magnitude"] = _this.treatmentPlanCdr[i - 3][3];
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/dosage/daily_timing/frequency|unit"] = "1/d";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/dosage/dose_unit|terminology"] = "UCUM";
                _this.treatmentPlanEHR["nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:" + i + "/repetition_timing/interval"] = "P" + _this.treatmentPlanCdr[i - 3][4] + "D";
            }
            ;
            console.log('body:', JSON.stringify(_this.treatmentPlanEHR));
            resolve();
            _this.sendTreatmentPlan();
        });
    };
    OnboardtreatmentplanPage.prototype.sendTreatmentPlan = function () {
        var _this = this;
        this.api.commitTreatmentPlan(this.ehrId, this.docName, this.treatmentPlanEHR)
            .then(function () {
            _this.api.deleteSession()
                .then(function () {
                _this.router.navigateByUrl('/onboardothermeds');
                // insert a catch error here if the plan does not commit
            });
        });
    };
    OnboardtreatmentplanPage = tslib_1.__decorate([
        Component({
            selector: 'app-onboardtreatmentplan',
            templateUrl: './onboardtreatmentplan.page.html',
            styleUrls: ['./onboardtreatmentplan.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, ApiService, FetchReadingService, ActionSheetController, Router, FormBuilder, DatabaseService])
    ], OnboardtreatmentplanPage);
    return OnboardtreatmentplanPage;
}());
export { OnboardtreatmentplanPage };
// {
//   "ctx/language": "en",
//   "ctx/territory": "GB",
//   "nephrotic_syndrome_treatment_plan/composer|id": this.docID,
//   "nephrotic_syndrome_treatment_plan/composer|id_scheme": this.typeID,
//   "nephrotic_syndrome_treatment_plan/composer|id_namespace": this.typeID + "Number",
//   "nephrotic_syndrome_treatment_plan/composer|name": this.treatmentForm.value.doctorsName,
//   "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id": "123456-123",
//   "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id_scheme": "ETHERCIS-SCHEME",
//   "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|id_namespace": "DEMOGRAPHIC",
//   "nephrotic_syndrome_treatment_plan/event_context/_health_care_facility|name": "FACILITY",
//   "nephrotic_syndrome_treatment_plan/event_context/start_time": this.now,
//   "nephrotic_syndrome_treatment_plan/event_context/setting|code": "238",
//   "nephrotic_syndrome_treatment_plan/event_context/setting|value": "Other Care",
//   "nephrotic_syndrome_treatment_plan/event_context/setting|terminology": "openehr",
//   "nephrotic_syndrome_treatment_plan/care_team/name": "Nephrotic syndrome team",
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/role": "Lead clinician",
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value": this.docID,
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|issuer": this.typeID,
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|assigner": this.typeID,
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/identifier:0/value|type": this.typeID + "number",
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/use|code": "at0002",
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/name:0/text": this.docName,
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/system|code": "at0012",
//   "nephrotic_syndrome_treatment_plan/care_team/participant:0/lead_clinician:0/telecom:0/value": this.docNumber,
//   "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/current_state|code": "245",
//   "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/careflow_step|code": "at0015",
//   "nephrotic_syndrome_treatment_plan/informed_consent/ism_transition/careflow_step|value": "Informed Consent Provided",
//   "nephrotic_syndrome_treatment_plan/informed_consent/consent_name": "Consent to Treatment plan and sharing information to EHR",
//   "nephrotic_syndrome_treatment_plan/informed_consent/time": "2019-07-12T02:56:37+01:00",
//   "nephrotic_syndrome_treatment_plan/language|code": "en",
//   "nephrotic_syndrome_treatment_plan/language|terminology": "ISO_639-1",
//   "nephrotic_syndrome_treatment_plan/territory|code": "GB",
//   "nephrotic_syndrome_treatment_plan/territory|terminology": "ISO_3166-1",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|code": "52388000",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|value": "Product containing prednisolone",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/medication_item|terminology": "SNOMED-CT",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/clinical_indication:0": "Nephrotic syndrome Maintenance",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/direction_sequence": 1,
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_amount|magnitude": 2,
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": 1,
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/therapeutic_direction:0/repetition_timing/interval": "P1D",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/order/timing": "2019-07-12 00:00:00",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/expiry_time": "2099-01-01T00:00:00.00Z",
//   "nephrotic_syndrome_treatment_plan/medication_order:0/narrative": "Nephrotic syndrome Maintenance",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|code": "52388000",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|value": "Product containing prednisolone",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/medication_item|terminology": "SNOMED-CT",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/clinical_indication:0": "Nephrotic syndrome Relapse",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/direction_sequence": 1,
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_amount|magnitude": 5,
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": 1,
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/therapeutic_direction:0/repetition_timing/interval": "P1D",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/order/timing": "2019-07-12 00:00:00",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/expiry_time": "2099-01-01T00:00:00.00Z",
//   "nephrotic_syndrome_treatment_plan/medication_order:1/narrative": "Nephrotic syndrome Relpase",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|code": "52388000",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|value": "Product containing prednisolone",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/medication_item|terminology": "SNOMED-CT",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/clinical_indication:0": "Nephrotic syndrome Remission",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/direction_sequence": 1,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/direction_duration": "P7D",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_amount|magnitude": 4,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_amount|unit": "1",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|code": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|value": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/daily_timing/frequency|magnitude": 1,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/daily_timing/frequency|unit": "1/d",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/dosage/dose_unit|terminology": "UCUM",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:0/repetition_timing/interval": "P1D",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/direction_sequence": 2,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/direction_duration": "P7D",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/dosage/dose_amount|magnitude": 3,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/dosage/dose_amount|unit": "1",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/dosage/dose_unit|code": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/dosage/dose_unit|value": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/dosage/daily_timing/frequency|magnitude": 1,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/dosage/daily_timing/frequency|unit": "1/d",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/dosage/dose_unit|terminology": "UCUM",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:1/repetition_timing/interval": "P1D",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/direction_sequence": 3,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/direction_duration": "P7D",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/dosage/dose_amount|magnitude": 2,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/dosage/dose_amount|unit": "1",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/dosage/dose_unit|code": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/dosage/dose_unit|value": "mg",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/dosage/daily_timing/frequency|magnitude": 2,
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/dosage/daily_timing/frequency|unit": "1/d",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/dosage/dose_unit|terminology": "UCUM",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/therapeutic_direction:2/repetition_timing/interval": "P1D",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/order/timing": "2019-07-12 00:00:00",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/expiry_time": "2099-01-01T00:00:00.00Z",
//   "nephrotic_syndrome_treatment_plan/medication_order:2/narrative": "Human readable instruction narrative"
// }
//# sourceMappingURL=onboardtreatmentplan.page.js.map