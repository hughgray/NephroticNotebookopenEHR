import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker-component';
var DatePickerModule = /** @class */ (function () {
    function DatePickerModule() {
    }
    DatePickerModule_1 = DatePickerModule;
    DatePickerModule.forRoot = function () {
        return {
            ngModule: DatePickerModule_1,
            providers: []
        };
    };
    var DatePickerModule_1;
    DatePickerModule = DatePickerModule_1 = tslib_1.__decorate([
        NgModule({
            imports: [
                IonicModule,
                CommonModule,
                FormsModule
            ],
            declarations: [
                DatePickerComponent,
            ],
            exports: [
                DatePickerComponent
            ]
        })
    ], DatePickerModule);
    return DatePickerModule;
}());
export { DatePickerModule };
//# sourceMappingURL=date-picker.module.js.map