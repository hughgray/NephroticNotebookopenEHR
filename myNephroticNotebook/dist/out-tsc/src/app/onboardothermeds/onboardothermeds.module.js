import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OnboardothermedsPage } from './onboardothermeds.page';
var routes = [
    {
        path: '',
        component: OnboardothermedsPage
    }
];
var OnboardothermedsPageModule = /** @class */ (function () {
    function OnboardothermedsPageModule() {
    }
    OnboardothermedsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [OnboardothermedsPage]
        })
    ], OnboardothermedsPageModule);
    return OnboardothermedsPageModule;
}());
export { OnboardothermedsPageModule };
//# sourceMappingURL=onboardothermeds.module.js.map