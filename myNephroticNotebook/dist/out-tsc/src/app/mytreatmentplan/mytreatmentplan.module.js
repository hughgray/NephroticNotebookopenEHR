import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MytreatmentplanPage } from './mytreatmentplan.page';
var routes = [
    {
        path: '',
        component: MytreatmentplanPage
    }
];
var MytreatmentplanPageModule = /** @class */ (function () {
    function MytreatmentplanPageModule() {
    }
    MytreatmentplanPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MytreatmentplanPage]
        })
    ], MytreatmentplanPageModule);
    return MytreatmentplanPageModule;
}());
export { MytreatmentplanPageModule };
//# sourceMappingURL=mytreatmentplan.module.js.map