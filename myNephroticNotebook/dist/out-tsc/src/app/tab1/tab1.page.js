import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatePickerComponent } from '../date-picker-component/date-picker-component';
import { FetchReadingService } from '../services/fetch-reading.service';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
var Tab1Page = /** @class */ (function () {
    function Tab1Page(DatePicker, fetchReading, database, platform) {
        this.DatePicker = DatePicker;
        this.fetchReading = fetchReading;
        this.database = database;
        this.platform = platform;
    }
    Tab1Page.prototype.ionViewDidEnter = function () {
    };
    Tab1Page.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.database.callDatabase().then(function (data) {
                //reload the data from database
                _this.DatePicker.showView = "calendar";
                _this.fetchReading.months_fetched.clear();
                _this.DatePicker.createCalendarWeeks();
                _this.DatePicker.scrollMonth(_this.DatePicker.yearSelected, _this.DatePicker.monthSelected, _this.DatePicker.years);
            });
        });
        this.fetchReading.treatmentState();
    };
    Tab1Page = tslib_1.__decorate([
        Component({
            selector: 'app-tab1',
            templateUrl: 'tab1.page.html',
            styleUrls: ['tab1.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [DatePickerComponent,
            FetchReadingService,
            DatabaseService,
            Platform])
    ], Tab1Page);
    return Tab1Page;
}());
export { Tab1Page };
//# sourceMappingURL=tab1.page.js.map