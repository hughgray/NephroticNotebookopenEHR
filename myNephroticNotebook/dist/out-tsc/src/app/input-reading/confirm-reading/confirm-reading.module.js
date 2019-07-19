import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ConfirmReadingPage } from './confirm-reading.page';
var routes = [
    {
        path: '',
        component: ConfirmReadingPage
    }
];
var ConfirmReadingPageModule = /** @class */ (function () {
    function ConfirmReadingPageModule() {
    }
    ConfirmReadingPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ConfirmReadingPage]
        })
    ], ConfirmReadingPageModule);
    return ConfirmReadingPageModule;
}());
export { ConfirmReadingPageModule };
//# sourceMappingURL=confirm-reading.module.js.map