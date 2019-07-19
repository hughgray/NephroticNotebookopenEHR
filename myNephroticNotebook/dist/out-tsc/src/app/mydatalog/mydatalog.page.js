import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Router } from '@angular/router';
var MydatalogPage = /** @class */ (function () {
    function MydatalogPage(router, fetchReading) {
        this.router = router;
        this.fetchReading = fetchReading;
        this.data_log = null;
    }
    MydatalogPage.prototype.ngOnInit = function () {
        var _this = this;
        this.fetchReading
            .dataLog()
            .then(function (data) {
            var existingData = Object.keys(data).length;
            if (existingData !== 0) {
                _this.data_log = data;
            }
            console.log("plan 1", _this.data_log);
            console.log("plan 3", _this.data_log[0].date);
            console.log("plan 4", _this.data_log[0].meds_taken);
            console.log("plan 5", _this.data_log[0].symbol);
        });
    };
    MydatalogPage.prototype.exportDataLog = function () {
        this.router.navigateByUrl('/tabs/tab3/mydatalog/exportlog');
    };
    MydatalogPage.prototype.goBack = function () {
        this.router.navigateByUrl('tabs/tab3');
    };
    MydatalogPage = tslib_1.__decorate([
        Component({
            selector: 'app-mydatalog',
            templateUrl: './mydatalog.page.html',
            styleUrls: ['./mydatalog.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, FetchReadingService])
    ], MydatalogPage);
    return MydatalogPage;
}());
export { MydatalogPage };
//# sourceMappingURL=mydatalog.page.js.map