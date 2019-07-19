import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MydetailsPage } from './mydetails.page';
var routes = [
    {
        path: '',
        component: MydetailsPage
    }
];
var MydetailsPageModule = /** @class */ (function () {
    function MydetailsPageModule() {
    }
    MydetailsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MydetailsPage]
        })
    ], MydetailsPageModule);
    return MydetailsPageModule;
}());
export { MydetailsPageModule };
//# sourceMappingURL=mydetails.module.js.map