import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FetchReadingService } from '../services/fetch-reading.service';
import { Router } from '@angular/router';
var MydetailsPage = /** @class */ (function () {
    function MydetailsPage(router, fetchReading) {
        this.router = router;
        this.fetchReading = fetchReading;
        this.myDetails = null;
        this.details = [];
        this.myBirthday = null;
    }
    MydetailsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.fetchReading
            .myProfileDetails()
            .then(function (data) {
            var existingData = Object.keys(data).length;
            if (existingData !== 0) {
                _this.myDetails = data;
            }
            console.log("my details from db", _this.myDetails);
            _this.makeArray(_this.myDetails);
            var dateonly = _this.myDetails[0].birthday.split("T")[0];
            _this.myBirthday = { date: dateonly };
            console.log("my details", _this.myDetails);
            console.log("my birthday", _this.myBirthday);
            console.log("birthday other", _this.myBirthday.date);
        });
    };
    MydetailsPage.prototype.makeArray = function (data) {
        var k;
        this.details.length = 0;
        for (k in data) {
            this.details.push(data[k].name, data[k].nhs, data[k].doc, data[k].num, data[k].birthday, data[k].othermeds, data[k].docId, data[k].idType, data[k].cdrProv);
        }
        console.log("plan from db", this.details);
        console.log("plan from db", this.details[0]);
        console.log("plan from db", this.details[1]);
    };
    MydetailsPage.prototype.goBack = function () {
        this.router.navigateByUrl('tabs/tab3');
    };
    MydetailsPage.prototype.editDetails = function () {
        this.router.navigateByUrl('/tabs/tab3/mydetails/editdetails');
    };
    MydetailsPage = tslib_1.__decorate([
        Component({
            selector: 'app-mydetails',
            templateUrl: './mydetails.page.html',
            styleUrls: ['./mydetails.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, FetchReadingService])
    ], MydetailsPage);
    return MydetailsPage;
}());
export { MydetailsPage };
//# sourceMappingURL=mydetails.page.js.map