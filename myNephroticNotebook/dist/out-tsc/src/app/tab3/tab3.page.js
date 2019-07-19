import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
var Tab3Page = /** @class */ (function () {
    function Tab3Page(router, database, platform) {
        this.router = router;
        this.database = database;
        this.platform = platform;
    }
    Tab3Page.prototype.ngOnInit = function () {
    };
    Tab3Page.prototype.openMyDetails = function () {
        this.router.navigateByUrl('/tabs/tab3/mydetails');
    };
    Tab3Page.prototype.openMyDataLog = function () {
        this.router.navigateByUrl('/tabs/tab3/mydatalog');
    };
    Tab3Page.prototype.openMyTreatmentPlan = function () {
        this.router.navigateByUrl('/tabs/tab3/mytreatmentplan');
    };
    Tab3Page = tslib_1.__decorate([
        Component({
            selector: 'app-tab3',
            templateUrl: './tab3.page.html',
            styleUrls: ['./tab3.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [Router, DatabaseService, Platform])
    ], Tab3Page);
    return Tab3Page;
}());
export { Tab3Page };
//# sourceMappingURL=tab3.page.js.map