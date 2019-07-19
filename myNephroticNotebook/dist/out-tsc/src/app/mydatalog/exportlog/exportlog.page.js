import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FetchReadingService } from '../../services/fetch-reading.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
var ExportlogPage = /** @class */ (function () {
    function ExportlogPage(storage, api, platform, file, fileNavigator, alertController, emailComposer, http, router, formBuilder, fetchReading) {
        this.storage = storage;
        this.api = api;
        this.platform = platform;
        this.file = file;
        this.fileNavigator = fileNavigator;
        this.alertController = alertController;
        this.emailComposer = emailComposer;
        this.http = http;
        this.router = router;
        this.formBuilder = formBuilder;
        this.fetchReading = fetchReading;
        this.export_data_log = null;
        this.jsonData = null;
        this.isThereData = false;
        this.csv = null;
        this.csvJSON = null;
        this.dirName = 'mydatalog';
        this.fileName = 'MyNephroticNotebook.csv';
        this.dirNameJson = 'myjsondatalog';
        this.fileNameJson = 'MyNephroticNotebookCDR.csv';
        this.nativeFilePath = null;
        this.nativeFilePathJson = null;
        this.dirPath = null;
        this.dirPathJson = null;
        this.nativePath = null;
        this.possiblePath = null;
        this.possiblePathJson = null;
        this.startdate = null;
        this.enddate = null;
        this.error_messages = {
            'dateFrom': [
                { type: 'required', message: 'This date is needed!' }
            ],
            'dateTo': [
                { type: 'required', message: 'This date is needed too!' }
            ]
        };
        this.dataLogForm = this.formBuilder.group({
            dateFrom: new FormControl('', Validators.compose([
                Validators.required
            ])),
            dateTo: new FormControl('', Validators.compose([
                Validators.required
            ]))
        });
    }
    ExportlogPage.prototype.ngOnInit = function () {
        this.presentAlertConfirm();
    };
    ExportlogPage.prototype.presentAlertConfirm = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            message: 'Please confirm that you are either sharing your own data here, or, you have the full consent of the patient to share this data.',
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function (blah) {
                                        console.log('Confirm Cancel');
                                        _this.router.navigateByUrl('tabs/tab3');
                                    }
                                }, {
                                    text: 'Okay',
                                    handler: function () {
                                        console.log('Confirm Okay');
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
    ExportlogPage.prototype.submit = function () {
        console.log('From: ', this.dataLogForm.value.dateFrom);
        console.log('To: ', this.dataLogForm.value.dateTo);
        this.startdate = this.dataLogForm.value.dateFrom.split('T', 2)[0];
        this.enddate = this.dataLogForm.value.dateTo.split('T', 2)[0];
        this.checkConsent();
    };
    ExportlogPage.prototype.checkConsent = function () {
        var _this = this;
        this.storage.get("EHR")
            .then(function (val) {
            console.log("val pulled from storage: ", val);
            if (val == 0) {
                console.log('No consent- just local storage');
                _this.getDataLog(_this.dataLogForm.value.dateFrom, _this.dataLogForm.value.dateTo);
            }
            else {
                console.log('ehrID exists so they consent');
                _this.getEhrId();
            }
        });
    };
    ExportlogPage.prototype.getDataLog = function (dateFrom, dateTo) {
        var _this = this;
        console.log("getDatalog reached");
        this.fetchReading
            .exportDataLog(dateFrom, dateTo)
            .then(function (data) {
            var existingData = Object.keys(data).length;
            if (existingData !== 0) {
                _this.export_data_log = data;
                _this.isThereData = true;
            }
            _this.convertToCSV();
        });
    };
    ExportlogPage.prototype.convertToCSV = function () {
        var _this = this;
        this.csv = papa.unparse(this.export_data_log);
        console.log("csv", this.csv);
        var result = this.file.createDir(this.file.dataDirectory, this.dirName, true);
        result.then(function (data) {
            _this.dirPath = data.toURL();
            console.log('Directory exists at:', _this.dirPath);
            var path = _this.file.writeFile(_this.dirPath, _this.fileName, _this.csv, { replace: true });
            path.then(function (dataFile) {
                _this.nativeFilePath = dataFile.toURL();
                console.log('File exists at:', _this.nativeFilePath);
                _this.checkPlatform();
            })
                .catch(function (error) {
                console.log('File doesn\'t exist:', error);
            });
        })
            .catch(function (error) {
            console.log('Directory doesn\'t exist:', error);
        });
    };
    ExportlogPage.prototype.checkPlatform = function () {
        if (this.platform.is('android')) {
            this.possiblePath = this.nativeFilePath;
            this.possiblePathJson = this.nativeFilePathJson;
            console.log("native path android", this.possiblePath);
            console.log("native path json android", this.possiblePath);
        }
        else {
            this.possiblePath = this.nativeFilePath.slice(7);
            this.possiblePathJson = this.nativeFilePathJson.slice(7);
            console.log("native path:", this.possiblePath);
            console.log("native path json:", this.possiblePath);
        }
        this.composeEmail();
    };
    ExportlogPage.prototype.composeEmail = function () {
        var email = {
            attachments: [this.possiblePath, this.possiblePathJson],
            subject: 'My Nephrotic Notebook Data Log',
            body: 'My Data Log \nFrom: ' + this.startdate + '\nTo: ' + this.enddate,
        };
        this.emailComposer.open(email);
    };
    ExportlogPage.prototype.goBack = function () {
        this.router.navigateByUrl('tabs/tab3');
    };
    ExportlogPage.prototype.getEhrId = function () {
        var _this = this;
        console.log("getting ehrID...");
        this.fetchReading.myProfileDetails()
            .then(function (data) {
            var existingData = Object.keys(data).length;
            if (existingData !== 0) {
                var ehrId = String(data[0].ehrid);
            }
            _this.getExportDataCDR(ehrId, _this.startdate, _this.enddate);
        });
    };
    ExportlogPage.prototype.getExportDataCDR = function (ehrID, dateFrom, dateTo) {
        var _this = this;
        this.api.getData(ehrID, dateFrom, dateTo)
            .then(function (data) {
            console.log("data on export page:", data);
            _this.jsonData = data;
            _this.convertJSONToCSV();
        });
    };
    ExportlogPage.prototype.convertJSONToCSV = function () {
        var _this = this;
        console.log("gowan: ", JSON.stringify(this.jsonData));
        var resultsData = this.jsonData.resultSet;
        console.log("just results set?:", resultsData);
        this.csvJSON = papa.unparse({
            fields: ["date", "reading", "readingNumeric", "doseAmount", "doseAmountUnit",
                "medicationAdministered", "doseAdminStepValue", "regime", "comment"],
            data: resultsData
        });
        console.log("JSON csv", this.csvJSON);
        var resultJson = this.file.createDir(this.file.dataDirectory, this.dirNameJson, true);
        resultJson.then(function (data) {
            _this.dirPathJson = data.toURL();
            console.log('JSON Directory exists at:', _this.dirPathJson);
            var path = _this.file.writeFile(_this.dirPathJson, _this.fileNameJson, _this.csvJSON, { replace: true });
            path.then(function (dataFile) {
                _this.nativeFilePathJson = dataFile.toURL();
                console.log('JSON File exists at:', _this.nativeFilePathJson);
                _this.getDataLog(_this.dataLogForm.value.dateFrom, _this.dataLogForm.value.dateTo);
            })
                .catch(function (error) {
                console.log('JSON File doesn\'t exist:', error);
            });
        })
            .catch(function (error) {
            console.log('JSON Directory doesn\'t exist:', error);
        });
    };
    ExportlogPage = tslib_1.__decorate([
        Component({
            selector: 'app-exportlog',
            templateUrl: './exportlog.page.html',
            styleUrls: ['./exportlog.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, ApiService, Platform, File, File, AlertController, EmailComposer, Http, Router, FormBuilder, FetchReadingService])
    ], ExportlogPage);
    return ExportlogPage;
}());
export { ExportlogPage };
//# sourceMappingURL=exportlog.page.js.map