import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExportlogPage } from './exportlog.page';
var routes = [
    {
        path: '',
        component: ExportlogPage
    }
];
var ExportlogPageModule = /** @class */ (function () {
    function ExportlogPageModule() {
    }
    ExportlogPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ExportlogPage]
        })
    ], ExportlogPageModule);
    return ExportlogPageModule;
}());
export { ExportlogPageModule };
//# sourceMappingURL=exportlog.module.js.map