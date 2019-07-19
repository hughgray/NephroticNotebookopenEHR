import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
var OnboardothermedsPage = /** @class */ (function () {
    function OnboardothermedsPage(router, database) {
        this.router = router;
        this.database = database;
    }
    OnboardothermedsPage.prototype.ngOnInit = function () {
    };
    OnboardothermedsPage.prototype.openHome = function () {
        this.router.navigateByUrl('/tabs/tab3');
    };
    OnboardothermedsPage.prototype.backToTreatmentPlan = function () {
        this.router.navigateByUrl('../onboardtrementplan');
    };
    OnboardothermedsPage.prototype.addToDB = function () {
        this.myOtherMedDetails = {
            "other_meds": this.myMeds,
        };
        this.database.insertData(this.myOtherMedDetails, "profileOtherMeds");
        console.log('Other Meds: ', this.myMeds);
        this.router.navigateByUrl('/tabs/tab2');
    };
    OnboardothermedsPage = tslib_1.__decorate([
        Component({
            selector: 'app-onboardothermeds',
            templateUrl: './onboardothermeds.page.html',
            styleUrls: ['./onboardothermeds.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, DatabaseService])
    ], OnboardothermedsPage);
    return OnboardothermedsPage;
}());
export { OnboardothermedsPage };
//# sourceMappingURL=onboardothermeds.page.js.map