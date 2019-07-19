import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
var CheckProfilePage = /** @class */ (function () {
    function CheckProfilePage(router, database, platform) {
        this.router = router;
        this.database = database;
        this.platform = platform;
    }
    CheckProfilePage.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            return _this.platform.ready().then(function () {
                console.log("check profile");
                _this.database.callDatabase().then(function (data) {
                    //check if profile already exists
                    _this.database.profileExists().then(function (onboard) {
                        if (onboard == true) {
                            //onboarding has already completed. Go to home page instead.
                            console.log("return profile exists");
                            _this.router.navigateByUrl('tabs/tab2');
                        }
                        else {
                            //onboarding has already completed. Go to home page instead.
                            console.log("route to onboarding");
                            _this.router.navigateByUrl('h');
                        }
                    });
                });
            });
        }, 4000);
    };
    CheckProfilePage = tslib_1.__decorate([
        Component({
            selector: 'app-check-profile',
            templateUrl: './check-profile.page.html',
            styleUrls: ['./check-profile.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, DatabaseService, Platform])
    ], CheckProfilePage);
    return CheckProfilePage;
}());
export { CheckProfilePage };
//# sourceMappingURL=check-profile.page.js.map