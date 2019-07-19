import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Router } from '@angular/router';
var MytreatmentplanPage = /** @class */ (function () {
    function MytreatmentplanPage(router, formBuilder, fetchReading) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.fetchReading = fetchReading;
        this.treatmentPlan = null;
        this.treatmentPlanId = null;
        this.planId = null;
        this.plan = null;
        this.isData = false;
    }
    MytreatmentplanPage.prototype.ngOnInit = function () {
        var _this = this;
        this.fetchReading
            .treatmentPlanID()
            .then(function (data) {
            _this.planId = data;
            console.log("id from db come on 4", _this.planId[0].planId);
            _this.planId = _this.planId[0].planId;
            console.log("ID to be retrieved", _this.planId);
            _this.getCurrentPlan(_this.planId);
        });
    };
    MytreatmentplanPage.prototype.getCurrentPlan = function (id) {
        var _this = this;
        this.fetchReading
            .treatmentPlan(id)
            .then(function (data) {
            var existingData = Object.keys(data).length;
            if (existingData !== 0) {
                _this.treatmentPlan = data;
                _this.isData = true;
            }
            console.log("plan 1", _this.treatmentPlan);
            console.log("plan 2", _this.treatmentPlan.amt);
            console.log("plan 3", _this.treatmentPlan[0].amt);
            console.log("plan 4", _this.treatmentPlan[1].dur);
            _this.populatePlan(_this.treatmentPlan);
        });
    };
    MytreatmentplanPage.prototype.makeArray = function (data) {
        var k;
        this.plan.length = 0;
        for (k in data) {
            this.plan.push(data[k].state, data[k].amt, data[k].dur, data[k].pillno, data[k].interval);
        }
        console.log("plan from db", this.plan);
        console.log("plan from db", this.plan[0]);
        console.log("plan from db", this.plan[1]);
    };
    MytreatmentplanPage.prototype.populatePlan = function (data) {
        this.plan = data.splice(0, 2);
        console.log("plan from db", this.plan);
        console.log("plan from db", this.plan[0].amt);
        console.log("plan from db", this.plan[1].amt);
    };
    MytreatmentplanPage.prototype.goBack = function () {
        this.router.navigateByUrl('tabs/tab3');
    };
    MytreatmentplanPage.prototype.editPlan = function () {
        this.router.navigateByUrl('tabs/tab3/mytreatmentplan/edit');
    };
    MytreatmentplanPage = tslib_1.__decorate([
        Component({
            selector: 'app-mytreatmentplan',
            templateUrl: './mytreatmentplan.page.html',
            styleUrls: ['./mytreatmentplan.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, FormBuilder, FetchReadingService])
    ], MytreatmentplanPage);
    return MytreatmentplanPage;
}());
export { MytreatmentplanPage };
//# sourceMappingURL=mytreatmentplan.page.js.map