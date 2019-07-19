import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
var Tab2Page = /** @class */ (function () {
    function Tab2Page(database, router, platform) {
        this.database = database;
        this.router = router;
        this.platform = platform;
    }
    Tab2Page.prototype.ngOnInit = function () {
        this.now = moment().format('YYYY-MM-DD') + ' 00:00:00';
        this.loadPage();
    };
    Tab2Page.prototype.loadPage = function () {
        var _this = this;
        var query = "SELECT * FROM daily_readings WHERE date_of_reading = '" + this.now + "';";
        this.database.doQuery(query)
            .then(function (result) {
            console.log('tab2Page print: ');
            console.log(result);
            _this.queryResult = result;
            if (_this.isEmpty(_this.queryResult)) {
                _this.isTodaysReadingCompleted = false;
            }
            else {
                _this.isTodaysReadingCompleted = true;
            }
            if (_this.isTodaysReadingCompleted) {
                console.log('already read today');
                _this.router.navigate(['tabs/tab2/post-reading']);
            }
            else {
                console.log('not yet read today');
                _this.router.navigate(['tabs/tab2/pre-reading']);
            }
        })
            .catch(function (error) {
            console.log('tab2 error');
        });
    };
    Tab2Page.prototype.ionViewWillEnter = function () {
        this.loadPage();
    };
    // this function checks if an object is empty
    Tab2Page.prototype.isEmpty = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };
    Tab2Page = tslib_1.__decorate([
        Component({
            selector: 'app-tab2',
            templateUrl: 'tab2.page.html',
            styleUrls: ['tab2.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [DatabaseService, Router, Platform])
    ], Tab2Page);
    return Tab2Page;
}());
export { Tab2Page };
//# sourceMappingURL=tab2.page.js.map