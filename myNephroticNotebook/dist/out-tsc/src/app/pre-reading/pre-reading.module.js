import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PreReadingPage } from './pre-reading.page';
var routes = [
    {
        path: '',
        component: PreReadingPage
    }
];
var PreReadingPageModule = /** @class */ (function () {
    function PreReadingPageModule() {
    }
    PreReadingPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [PreReadingPage]
        })
    ], PreReadingPageModule);
    return PreReadingPageModule;
}());
export { PreReadingPageModule };
//# sourceMappingURL=pre-reading.module.js.map