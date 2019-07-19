import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Storage } from '@ionic/storage';
var ApiService = /** @class */ (function () {
    function ApiService(fetchReading, storage, http, platform, database) {
        this.fetchReading = fetchReading;
        this.storage = storage;
        this.http = http;
        this.platform = platform;
        this.database = database;
        this.templateIdReading = 'MNNB - Nephrotic self-monitoring-v0';
        this.templateIdTreatment = 'MNNB - Treatment Plan';
        this.subjectNamespace = 'uk.nhs.nhs_number';
        this.newEHR = {
            "queryable": "true",
            "modifiable": "true"
        };
    }
    ApiService.prototype.setCDRVariables = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.storage.get("CDR")
                .then(function (data) {
                if (data == "Gosh") {
                    _this.headerDict = {
                        "Content-Type": "application/json",
                        "Ehr-Session-disabled": "1917e50d-65d3-4c2c-94e3-0b5d303e0b72",
                        "Authorization": "Basic YjI5ZWNhZGUtZWI2NS00NzQ4LThhNjEtMDE1NjQyMWMyNmFkOiQyYSQxMCQ2MTlraQ=="
                    };
                    _this.cdrRestBaseUrl = 'https://cdr.code4health.org/rest/v1';
                    _this.requestOptions = {
                        headers: new HttpHeaders(_this.headerDict),
                    };
                    console.log('CDR details set to marand:');
                    console.log('URL: ', _this.cdrRestBaseUrl);
                    console.log('Headers: ', JSON.stringify(_this.headerDict));
                    resolve();
                }
                else {
                    _this.createSession()
                        .then(function () {
                        _this.headerDict = {
                            "Content-Type": "application/json",
                            "Ehr-Session": _this.sessionId
                        };
                        _this.cdrRestBaseUrl = 'http://localhost:8081/rest/v1';
                        _this.requestOptions = {
                            headers: new HttpHeaders(_this.headerDict),
                        };
                        console.log('CDR details set to ethersis:');
                        console.log('URL: ', _this.cdrRestBaseUrl);
                        console.log('Headers: ', JSON.stringify(_this.headerDict));
                        resolve();
                    });
                }
            });
        });
    };
    ApiService.prototype.createSession = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var createSesh = "http://localhost:8081/rest/v1/session?username=guest&password=guest";
            _this.http.post(createSesh, {})
                .subscribe(function (data) {
                console.log(data);
                var json = JSON.stringify(data);
                var info = JSON.parse(json);
                _this.sessionId = info.sessionId;
                console.log('sessionID:', _this.sessionId);
                var res = 'good';
                resolve(res);
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.log('Session create Bad 1!');
                    console.error('An error occurred:', error.error.message);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log('Session create Bad 2!');
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                    resolve();
                }
            });
        });
    };
    ApiService.prototype.deleteSession = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var deleteSesh = _this.cdrRestBaseUrl + "/session";
            _this.http.delete(deleteSesh, {})
                .subscribe(function (data) {
                console.log(data);
                var json = JSON.stringify(data);
                var info = JSON.parse(json);
                console.log('Session:', info.action);
                var res = 'good';
                resolve(res);
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.log('Session delete Bad 1!');
                    console.error('An error occurred:', error.error.message);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log('Session delete Bad 2!');
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                    resolve();
                }
            });
        });
    };
    ApiService.prototype.getTemplates = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var templateUrl = _this.cdrRestBaseUrl + "/template";
            _this.http.get(templateUrl, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log('Connection to CDR Bad 1!');
                    _this.storage.set("Connection", 0);
                    resolve();
                }
                else {
                    console.log("templateId in", JSON.stringify(data));
                    _this.storage.set("Connection", 1);
                    console.log("Connection flag", 1);
                    resolve();
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.log('Connection to CDR Bad 2!');
                    console.error('An error occurred:', error.error.message);
                    _this.storage.set("Connection", 0);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log('Connection to CDR Bad 3!');
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                    _this.storage.set("Connection", 0);
                    resolve();
                }
            });
        });
    };
    ApiService.prototype.getTemplateAct = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var templateUrl = _this.cdrRestBaseUrl + "/template/" + _this.templateIdReading;
            _this.http.get(templateUrl, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log('Connection to CDR Bad 1!');
                    _this.storage.set("Connection", 0);
                    resolve();
                }
                else {
                    console.log("templateId in", JSON.stringify(data));
                    _this.storage.set("Connection", 1);
                    console.log("Connection flag", 1);
                    resolve();
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.log('Connection to CDR Bad 2!');
                    console.error('An error occurred:', error.error.message);
                    _this.storage.set("Connection", 0);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log('Connection to CDR Bad 3!');
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                    _this.storage.set("Connection", 0);
                    resolve();
                }
            });
        });
    };
    ApiService.prototype.getEHRstatus = function (subjectId) {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('checking number:', subjectId);
            var EHRstatusUrl = _this.cdrRestBaseUrl + "/ehr/?subjectId=" + subjectId + "&subjectNamespace=" + _this.subjectNamespace;
            _this.http.get(EHRstatusUrl, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log('creating ehr');
                    _this.createEHRid(subjectId)
                        .then(function (q) {
                        resolve(q);
                    });
                }
                else {
                    console.log("ehrID exists in:", data);
                    var json = JSON.stringify(data);
                    var info = JSON.parse(json);
                    _this.ehrID = info.ehrId;
                    console.log('ehrID:', _this.ehrID);
                    var res = 'good';
                    resolve(res);
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('Error checking for EHR');
                    console.error('An error occurred:', error.error.message);
                    _this.createEHRid(subjectId)
                        .then(function (q) {
                        resolve(q);
                    });
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error('Error checking for EHR');
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                    _this.createEHRid(subjectId)
                        .then(function (q) {
                        resolve(q);
                    });
                }
            });
        });
    };
    ApiService.prototype.createEHRid = function (subjectId) {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('creating number:', subjectId);
            var createEHRUrl = _this.cdrRestBaseUrl + "/ehr?subjectId=" + subjectId + "&subjectNamespace=" + _this.subjectNamespace;
            _this.http.post(createEHRUrl, _this.newEHR, _this.requestOptions)
                .subscribe(function (data) {
                console.log(data);
                var json = JSON.stringify(data);
                var info = JSON.parse(json);
                _this.ehrID = info.ehrId;
                console.log('ehrID:', _this.ehrID);
                _this.addToDB();
                var res = 'good';
                resolve(res);
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('Error creating new EHR');
                    console.error('An error occurred:', error.error.message);
                    var res = 'error';
                    resolve(res);
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error('Error creating new EHR');
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                    var res = 'error';
                    resolve(res);
                }
            });
        });
    };
    ApiService.prototype.addToDB = function () {
        var ehrid = {
            "ehr_id": this.ehrID,
        };
        this.database.insertData(ehrid, "profileEHRid");
        console.log('EHR ID added to db: ', this.ehrID);
    };
    ApiService.prototype.getEHRstatusUpdate = function (subjectId) {
        var _this = this;
        return new Promise(function (resolve) {
            var EHRstatusUrl = _this.cdrRestBaseUrl + "/ehr/?subjectId=" + subjectId + "&subjectNamespace=" + _this.subjectNamespace;
            _this.http.get(EHRstatusUrl, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log('creating ehr');
                    _this.createEHRidUpdate(subjectId);
                }
                else {
                    console.log("ehrID exists in:", data);
                    var json = JSON.stringify(data);
                    var info = JSON.parse(json);
                    _this.ehrID = info.ehrId;
                    console.log('ehrID:', _this.ehrID);
                    _this.addToDBupdate();
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                }
            });
            resolve();
        });
    };
    ApiService.prototype.createEHRidUpdate = function (subjectId) {
        var _this = this;
        return new Promise(function (resolve) {
            var createEHRUrl = _this.cdrRestBaseUrl + "/ehr?subjectId=" + subjectId + "&subjectNamespace=" + _this.subjectNamespace;
            _this.http.post(createEHRUrl, _this.newEHR, _this.requestOptions)
                .subscribe(function (data) {
                console.log(data);
                var json = JSON.stringify(data);
                var info = JSON.parse(json);
                _this.ehrID = info.ehrId;
                console.log('ehrID:', _this.ehrID);
                _this.addToDBupdate();
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error("Backend returned code " + error.status + ", " +
                        ("body was: " + error.error));
                }
            });
            resolve();
        });
    };
    ApiService.prototype.addToDBupdate = function () {
        var ehrid = {
            "ehr_id": this.ehrID,
        };
        this.database.insertData(ehrid, "profileEHRidUpdate");
        console.log('EHR ID: ', this.ehrID);
    };
    ApiService.prototype.commitComposition = function (ehrId, committerName, dailyReading) {
        var _this = this;
        return new Promise(function (resolve) {
            var commitDailyComp = _this.cdrRestBaseUrl + "/composition?ehrId=" + ehrId + "&templateId=" + _this.templateIdReading + "&committerName=" + committerName + "&format=FLAT";
            _this.http.post(commitDailyComp, dailyReading, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log('commit to db');
                    _this.storage.set("Connection", 0)
                        .then(function () {
                        _this.storeReading(dailyReading);
                        resolve();
                    });
                    console.log("Connection flag set to 0");
                }
                else {
                    console.log("Daily Reading Added:", JSON.stringify(data));
                    var json = JSON.stringify(data);
                    var info = JSON.parse(json);
                    _this.compUid = info.compositionUid;
                    console.log('CompUid:', _this.compUid);
                    console.log("Connection flagset to 1 by commit comp");
                    _this.storage.set("Connection", 1)
                        .then(function () {
                        _this.dropJSON();
                        resolve();
                    });
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                    _this.storage.set("Connection", 0);
                    console.log("Connection flag set to 0");
                    _this.storage.set("Connection", 0)
                        .then(function () {
                        _this.storeReading(dailyReading);
                        resolve();
                    });
                    console.log("Connection flag set to 0");
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error("Backend returned code " + error.status + ", " +
                        "body was:", JSON.stringify(error.error));
                    _this.storage.set("Connection", 0)
                        .then(function () {
                        _this.storeReading(dailyReading);
                        resolve();
                    });
                    console.log("Connection flag set to 0");
                }
            });
        });
    };
    ApiService.prototype.storeReading = function (dailyReading) {
        var _this = this;
        return new Promise(function (resolve) {
            var dailyReadingJString = JSON.stringify(dailyReading);
            console.log('stored json:', dailyReadingJString);
            console.log('Reading: ', dailyReadingJString);
            var dayReading = {
                "jsonReading": dailyReadingJString
            };
            console.log('Reading 2: ', dayReading);
            _this.database.insertData(dayReading, "jsonReadings")
                .then(function () {
                return resolve();
            });
        });
    };
    ApiService.prototype.dropJSON = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.dropJsonData()
                .then(function () {
                _this.sendStoredReadings();
                return resolve();
            });
            console.log('just dropped, now sending stored readings...');
        });
    };
    ApiService.prototype.sendStoredReadings = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.fetchReading.getJsonReadings()
                .then(function (data) {
                var existingData = Object.keys(data).length;
                if (existingData !== 0) {
                    _this.jsonReading = data;
                    console.log('dataStoredJSON', _this.jsonReading);
                    console.log('dataStoredJSON', _this.jsonReading[0].Body);
                    _this.getStoredDetails();
                    return resolve();
                }
                else {
                    return resolve();
                }
            });
        });
    };
    ApiService.prototype.getStoredDetails = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.fetchReading.myProfileDetails()
                .then(function (data) {
                _this.myName = data[0].name;
                _this.ehrId = data[0].ehrid;
                console.log('sending stored readings top...');
                console.log('sending stored readings...');
                _this.loopReadings()
                    .then(function () {
                    return resolve();
                });
            });
        });
    };
    ApiService.prototype.loopReadings = function () {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('length of thingy:', _this.jsonReading.length);
            for (var i = 0; i < _this.jsonReading.length; i++) {
                new Promise(function (resolve) {
                    console.log('ehrID:', _this.ehrId);
                    console.log('name:', _this.myName);
                    var readingDayS = String(_this.jsonReading[i].Body);
                    var readingDay = JSON.parse(readingDayS);
                    console.log('readingDay', readingDay);
                    console.log('number', _this.jsonReading[i].Number);
                    return _this.commitStoredComposition(_this.ehrId, _this.myName, readingDay, _this.jsonReading[i].Number)
                        .then(function () {
                        return resolve();
                    });
                });
            }
        });
    };
    ApiService.prototype.commitStoredComposition = function (ehrId, committerName, dailyReading, number) {
        var _this = this;
        return new Promise(function (resolve) {
            var commitDailyComp = _this.cdrRestBaseUrl + "/composition?ehrId=" + ehrId + "&templateId=" + _this.templateIdReading + "&committerName=" + committerName + "&format=FLAT";
            _this.http.post(commitDailyComp, dailyReading, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log('not working');
                    resolve();
                }
                else {
                    console.log("Daily Reading Added:", JSON.stringify(data));
                    var json = JSON.stringify(data);
                    var info = JSON.parse(json);
                    var compUid = info.compositionUid;
                    console.log('CompUid:', compUid);
                    _this.storeReadingUid(compUid, number)
                        .then(function () {
                        return resolve();
                    });
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error("Backend returned code " + error.status + ", " +
                        "body was:", JSON.stringify(error.error));
                    resolve();
                }
            });
        });
    };
    ApiService.prototype.storeReadingUid = function (compUid, number) {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('CompUid: ', compUid);
            console.log('Number: ', number);
            var dayReadingFill = {
                "jsonNo": number,
                "compUid": compUid,
            };
            _this.database.insertData(dayReadingFill, "jsonReadingsUid")
                .then(function () {
                return resolve();
            });
            console.log('Reading: ', dayReadingFill);
        });
    };
    ApiService.prototype.commitTreatmentPlan = function (ehrId, committerName, treatmentPlan) {
        var _this = this;
        return new Promise(function (resolve) {
            var commitDailyComp = _this.cdrRestBaseUrl + "/composition?ehrId=" + ehrId + "&templateId=" + _this.templateIdTreatment + "&committerName=" + committerName + "&format=FLAT";
            _this.http.post(commitDailyComp, treatmentPlan, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log("Data null- bad news");
                    resolve();
                }
                else {
                    console.log("Treatment Plan Added:", JSON.stringify(data));
                    var json = JSON.stringify(data);
                    var info = JSON.parse(json);
                    var planUid = info.compositionUid;
                    console.log('PlanUid:', _this.compUid);
                    console.log("Storing Plan Uid");
                    _this.storePlanUid(planUid)
                        .then(function () {
                        resolve();
                    });
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error("Backend returned code " + error.status + ", " +
                        "body was:", JSON.stringify(error.error));
                    resolve();
                }
            });
        });
    };
    ApiService.prototype.storePlanUid = function (planUid) {
        var _this = this;
        return new Promise(function (resolve) {
            console.log('PlanUid: ', planUid);
            var Uid = {
                "planUid": planUid,
            };
            _this.database.insertData(Uid, "treatmentUid")
                .then(function () {
                return resolve();
            });
        });
    };
    ApiService.prototype.commitNewTreatmentPlan = function (compositionId, treatmentPlan) {
        var _this = this;
        return new Promise(function (resolve) {
            var commitDailyComp = _this.cdrRestBaseUrl + "/composition/" + compositionId + "?format=FLAT&templateId=" + _this.templateIdTreatment;
            _this.http.put(commitDailyComp, treatmentPlan, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log("Data null- bad news");
                    resolve();
                }
                else {
                    console.log("New Treatment Plan Added:", JSON.stringify(data));
                    var json = JSON.stringify(data);
                    var info = JSON.parse(json);
                    var planUid = info.compositionUid;
                    console.log('PlanUid:', _this.compUid);
                    console.log("Storing Plan Uid");
                    _this.storePlanUid(planUid)
                        .then(function () {
                        resolve();
                    });
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error("Backend returned code " + error.status + ", " +
                        "body was:", JSON.stringify(error.error));
                    resolve();
                }
            });
        });
    };
    ApiService.prototype.getData = function (ehrID, startdate, enddate) {
        var _this = this;
        return new Promise(function (resolve) {
            var commitDailyComp = _this.cdrRestBaseUrl + "/query";
            var aql = "select \n                    a/context/start_time/value as date, \n                    b_a/data[at0001]/events[at0002]/data[at0003]/items[at0095]/value/value as readingNumeric, \n                    b_a/data[at0001]/events[at0002]/data[at0003]/items[at0095]/value/symbol/value as reading, \n                    b_b/items[at0001]/value/value as nephroticStatus, b_d/items[at0144]/value/magnitude as doseAmount, \n                    b_d/items[at0145]/value/defining_code/code_string as doseAmountUnit, \n                    b_c/description[at0017]/items[at0020]/value/value as medicationAdministered, \n                    b_c/ism_transition/careflow_step/value as doseAdminStepValue,\n                    b_c/description[at0017]/items[at0021]/value/value as regime, \n                    b_c/description[at0017]/items[at0024]/value/value as comment \n                  from EHR e[ehr_id/value='" + ehrID + "'] \n                  contains COMPOSITION a[openEHR-EHR-COMPOSITION.self_monitoring.v0] \n                  contains (OBSERVATION b_a[openEHR-EHR-OBSERVATION.urinalysis.v1] \n                    or CLUSTER b_b[openEHR-EHR-CLUSTER.nephrotic_syndrome_status.v0] \n                    or ACTION b_c[openEHR-EHR-ACTION.medication.v1] or CLUSTER b_d[openEHR-EHR-CLUSTER.dosage.v1]) \n                  where a/name/value='Nephrotic syndrome self monitoring' \n                  and date >= '" + startdate + "'\n                  and date <= '" + enddate + "'\n                  order by date DESC";
            var query = { "aql": aql };
            console.log("Query as json?: ", query);
            _this.http.post(commitDailyComp, query, _this.requestOptions)
                .subscribe(function (data) {
                if (data == null) {
                    console.log("Data null- bad news");
                    resolve();
                }
                else {
                    console.log("Query returns:", JSON.stringify(data));
                    resolve(data);
                }
            }, function (error) {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                    resolve();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.error("Backend returned code " + error.status + ", " +
                        "body was:", JSON.stringify(error.error));
                    resolve();
                }
            });
        });
    };
    ApiService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [FetchReadingService, Storage, HttpClient, Platform, DatabaseService])
    ], ApiService);
    return ApiService;
}());
export { ApiService };
//# sourceMappingURL=api.service.js.map