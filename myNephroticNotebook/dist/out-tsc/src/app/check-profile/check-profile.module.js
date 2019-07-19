import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CheckProfilePage } from './check-profile.page';
var routes = [
    {
        path: '',
        component: CheckProfilePage
    }
];
var CheckProfilePageModule = /** @class */ (function () {
    function CheckProfilePageModule() {
    }
    CheckProfilePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [CheckProfilePage]
        })
    ], CheckProfilePageModule);
    return CheckProfilePageModule;
}());
export { CheckProfilePageModule };
//# sourceMappingURL=check-profile.module.js.map