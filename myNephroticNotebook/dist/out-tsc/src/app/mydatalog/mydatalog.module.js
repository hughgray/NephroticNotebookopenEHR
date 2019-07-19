import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MydatalogPage } from './mydatalog.page';
var routes = [
    {
        path: '',
        component: MydatalogPage
    }
];
var MydatalogPageModule = /** @class */ (function () {
    function MydatalogPageModule() {
    }
    MydatalogPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MydatalogPage]
        })
    ], MydatalogPageModule);
    return MydatalogPageModule;
}());
export { MydatalogPageModule };
//# sourceMappingURL=mydatalog.module.js.map