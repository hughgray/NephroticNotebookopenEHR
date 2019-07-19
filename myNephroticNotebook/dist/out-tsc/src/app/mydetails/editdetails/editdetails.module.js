import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditdetailsPage } from './editdetails.page';
var routes = [
    {
        path: '',
        component: EditdetailsPage
    }
];
var EditdetailsPageModule = /** @class */ (function () {
    function EditdetailsPageModule() {
    }
    EditdetailsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [EditdetailsPage]
        })
    ], EditdetailsPageModule);
    return EditdetailsPageModule;
}());
export { EditdetailsPageModule };
//# sourceMappingURL=editdetails.module.js.map