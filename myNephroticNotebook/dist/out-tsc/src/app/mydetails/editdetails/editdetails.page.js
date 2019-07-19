import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
var EditdetailsPage = /** @class */ (function () {
    function EditdetailsPage(storage, network, alertController, api, router, formBuilder, database) {
        this.storage = storage;
        this.network = network;
        this.alertController = alertController;
        this.api = api;
        this.router = router;
        this.formBuilder = formBuilder;
        this.database = database;
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
            ])),
            myOtherMeds: new FormControl('')
        });
    }
    EditdetailsPage.prototype.ngOnInit = function () {
        this.storage.set("Connection", 1);
        console.log("consent flag", this.consent);
        this.storage.set("EHR", 0);
        console.log("EHR flag: 0");
        this.presentAlertConfirm();
    };
    EditdetailsPage.prototype.noNetworkConnection = function () {
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
    EditdetailsPage.prototype.noCdrChosen = function () {
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
    EditdetailsPage.prototype.presentAlertConfirm = function () {
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
    EditdetailsPage.prototype.presentAlertConfirmNo = function () {
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
    EditdetailsPage.prototype.checkConnection = function () {
        var _this = this;
        console.log("Checking Connection flag....");
        if (this.consent == true && this.profileForm.value.cdrProvider == 'None') {
            this.noCdrChosen();
        }
        else if (this.consent == true) {
            this.api.getTemplates()
                .then(function () {
                return _this.continueCheck();
            });
        }
        else {
            this.continueCheck();
        }
    };
    EditdetailsPage.prototype.continueCheck = function () {
        var _this = this;
        this.storage.get("Connection")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 0) {
                _this.noNetworkConnection();
            }
            else {
                console.log("did that work?");
                _this.addToDB();
            }
        });
    };
    EditdetailsPage.prototype.checkConnection = function () {
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
    EditdetailsPage.prototype.continueCheck = function () {
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
    EditdetailsPage.prototype.mydetails = function () {
        console.log('Name: ', this.profileForm.value.myName);
        console.log('NHS no: ', this.profileForm.value.myNHSno);
        console.log('Doctor: ', this.profileForm.value.myDoctor);
        console.log('Doctors #: ', this.profileForm.value.myDoctorsNumber);
        console.log('ID: ', this.profileForm.value.docID);
        console.log('Type: ', this.profileForm.value.docType);
        console.log('CDR: ', this.profileForm.value.cdrProvider);
        console.log('Birthday: ', this.profileForm.value.myBirthday);
        console.log('Other_meds: ', this.profileForm.value.myOtherMeds);
    };
    EditdetailsPage.prototype.addToDB = function () {
        var _this = this;
        var myProfileDetailsBetter = [
            this.profileForm.value.myName,
            this.profileForm.value.myNHSno,
            this.profileForm.value.myBirthday,
            this.profileForm.value.myDoctor,
            this.profileForm.value.myDoctorsNumber,
            this.profileForm.value.myOtherMeds,
            this.profileForm.value.docID,
            this.profileForm.value.docType,
            this.profileForm.value.cdrProvider
        ];
        this.database.insertData(myProfileDetailsBetter, "profileUpdate")
            .then(function () {
            if (_this.consent == true) {
                _this.api.addToDB();
                _this.router.navigateByUrl('/tabs/tab3');
            }
            else {
                _this.router.navigateByUrl('/onboardtreatmentplan');
            }
        });
        console.log('Checker: ', myProfileDetailsBetter);
        if (this.consent == true) {
            this.api.getEHRstatus(this.profileForm.value.myNHSno)
                .then(function () {
                _this.router.navigateByUrl('/tabs/tab3');
            });
        }
        else {
            this.router.navigateByUrl('/tabs/tab3');
        }
    };
    EditdetailsPage.prototype.addToDB = function () {
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
    EditdetailsPage.prototype.ehrPlay = function () {
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
    EditdetailsPage.prototype.goBack = function () {
        this.router.navigateByUrl('tabs/tab3');
    };
    EditdetailsPage = tslib_1.__decorate([
        Component({
            selector: 'app-editdetails',
            templateUrl: './editdetails.page.html',
            styleUrls: ['./editdetails.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, Network, AlertController, ApiService, Router, FormBuilder, DatabaseService])
    ], EditdetailsPage);
    return EditdetailsPage;
}());
export { EditdetailsPage };
//# sourceMappingURL=editdetails.page.js.map