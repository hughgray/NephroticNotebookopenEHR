import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';
var PreReadingPage = /** @class */ (function () {
    function PreReadingPage(router, database, storage) {
        this.router = router;
        this.database = database;
        this.storage = storage;
    }
    PreReadingPage.prototype.goToInputReading = function () {
        this.router.navigateByUrl('tabs/tab2/input-reading');
    };
    PreReadingPage.prototype.saveDaysStartingState = function () {
        var _this = this;
        this.database.doQuery("SELECT * FROM active_treatment_state")
            .then(function (val1) {
            console.log("saveDaysStartingState");
            console.log(val1);
            _this.orig_state = val1[1]["active_treatment_state_id"];
            _this.orig_start_date = val1[1]["date_started"];
            _this.origStateObj = {
                "orig_state": _this.orig_state,
                "orig_start_date": _this.orig_start_date
            };
            console.log(_this.origStateObj);
        })
            .then(function (val) {
            _this.storage.set("origStateObj", _this.origStateObj);
        })
            .then(function () {
            console.log('Stored original state = in Ion-Storage');
            console.log(_this.origStateObj);
        });
    };
    PreReadingPage.prototype.ngOnInit = function () {
        this.storage.set("Connection", 0);
        console.log('set connection to 0');
        this.saveDaysStartingState();
        this.today = new Date();
        this.dd = this.today.getDate();
        this.mm = this.today.getMonth();
        switch (this.mm) {
            case this.mm = 0:
                this.mmstr = "Jan";
                break;
            case this.mm = 1:
                this.mmstr = "Feb";
                break;
            case this.mm = 2:
                this.mmstr = "Mar";
                break;
            case this.mm = 3:
                this.mmstr = "Apr";
                break;
            case this.mm = 4:
                this.mmstr = "May";
                break;
            case this.mm = 5:
                this.mmstr = "Jun";
                break;
            case this.mm = 6:
                this.mmstr = "Jul";
                break;
            case this.mm = 7:
                this.mmstr = "Aug";
                break;
            case this.mm = 8:
                this.mmstr = "Sep";
                break;
            case this.mm = 9:
                this.mmstr = "Oct";
                break;
            case this.mm = 10:
                this.mmstr = "Nov";
                break;
            case this.mm = 11:
                this.mmstr = "Dec";
        }
        this.todayStr = this.mmstr.toUpperCase() + ' ' + this.dd;
    };
    PreReadingPage = tslib_1.__decorate([
        Component({
            selector: 'app-pre-reading',
            templateUrl: './pre-reading.page.html',
            styleUrls: ['./pre-reading.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            DatabaseService,
            Storage])
    ], PreReadingPage);
    return PreReadingPage;
}());
export { PreReadingPage };
//# sourceMappingURL=pre-reading.page.js.map