import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OnboardPage } from './onboard.page';
var routes = [
    {
        path: '',
        component: OnboardPage
    }
];
var OnboardPageModule = /** @class */ (function () {
    function OnboardPageModule() {
    }
    OnboardPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [OnboardPage]
        })
    ], OnboardPageModule);
    return OnboardPageModule;
}());
export { OnboardPageModule };
//# sourceMappingURL=onboard.module.js.map