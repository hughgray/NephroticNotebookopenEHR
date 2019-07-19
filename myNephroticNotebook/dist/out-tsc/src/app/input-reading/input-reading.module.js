import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InputReadingPage } from './input-reading.page';
var routes = [
    {
        path: '',
        component: InputReadingPage
    }
];
var InputReadingPageModule = /** @class */ (function () {
    function InputReadingPageModule() {
    }
    InputReadingPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [InputReadingPage]
        })
    ], InputReadingPageModule);
    return InputReadingPageModule;
}());
export { InputReadingPageModule };
//# sourceMappingURL=input-reading.module.js.map