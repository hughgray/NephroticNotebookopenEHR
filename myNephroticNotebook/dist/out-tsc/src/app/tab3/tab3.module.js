import * as tslib_1 from "tslib";
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
var routes = [
    {
        path: '',
        component: Tab3Page
    }
];
var Tab3PageModule = /** @class */ (function () {
    function Tab3PageModule() {
    }
    Tab3PageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                IonicModule,
                CommonModule,
                FormsModule,
                RouterModule.forChild(routes)
            ],
            declarations: [Tab3Page]
        })
    ], Tab3PageModule);
    return Tab3PageModule;
}());
export { Tab3PageModule };
//# sourceMappingURL=tab3.module.js.map