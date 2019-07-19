import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PostReadingPage } from './post-reading.page';
var routes = [
    {
        path: '',
        component: PostReadingPage
    }
];
var PostReadingPageModule = /** @class */ (function () {
    function PostReadingPageModule() {
    }
    PostReadingPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [PostReadingPage]
        })
    ], PostReadingPageModule);
    return PostReadingPageModule;
}());
export { PostReadingPageModule };
//# sourceMappingURL=post-reading.module.js.map