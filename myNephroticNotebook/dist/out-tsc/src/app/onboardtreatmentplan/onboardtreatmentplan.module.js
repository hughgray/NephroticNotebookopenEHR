import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OnboardtreatmentplanPage } from './onboardtreatmentplan.page';
var routes = [
    {
        path: '',
        component: OnboardtreatmentplanPage
    }
];
var OnboardtreatmentplanPageModule = /** @class */ (function () {
    function OnboardtreatmentplanPageModule() {
    }
    OnboardtreatmentplanPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [OnboardtreatmentplanPage]
        })
    ], OnboardtreatmentplanPageModule);
    return OnboardtreatmentplanPageModule;
}());
export { OnboardtreatmentplanPageModule };
//# sourceMappingURL=onboardtreatmentplan.module.js.map