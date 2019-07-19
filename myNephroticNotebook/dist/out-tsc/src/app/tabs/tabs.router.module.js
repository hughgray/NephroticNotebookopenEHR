import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPage } from './tabs.page';
import { IonicModule } from '@ionic/angular';
var routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'tab1',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab1/tab1.module#Tab1PageModule'
                    }
                ]
            },
            {
                path: 'tab2',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab2/tab2.module#Tab2PageModule'
                    },
                ]
            },
            {
                path: 'tab3',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab3/tab3.module#Tab3PageModule'
                    }
                ]
            },
            {
                path: 'tab2/pre-reading',
                loadChildren: '../pre-reading/pre-reading.module#PreReadingPageModule'
            },
            {
                path: 'tab2/post-reading',
                loadChildren: '../post-reading/post-reading.module#PostReadingPageModule'
            },
            {
                path: 'tab2/input-reading',
                loadChildren: '../input-reading/input-reading.module#InputReadingPageModule'
            },
            {
                path: 'tab2/input-reading/confirm-reading/:reading',
                loadChildren: '../input-reading/confirm-reading/confirm-reading.module#ConfirmReadingPageModule'
            },
            {
                path: 'tab3/mydetails',
                loadChildren: '../mydetails/mydetails.module#MydetailsPageModule'
            },
            {
                path: 'tab3/mydetails/editdetails',
                loadChildren: '../mydetails/editdetails/editdetails.module#EditdetailsPageModule'
            },
            {
                path: 'tab3/mydatalog',
                loadChildren: '../mydatalog/mydatalog.module#MydatalogPageModule'
            },
            {
                path: 'tab3/mydatalog/exportlog',
                loadChildren: '../mydatalog/exportlog/exportlog.module#ExportlogPageModule'
            },
            {
                path: 'tab3/mytreatmentplan',
                loadChildren: '../mytreatmentplan/mytreatmentplan.module#MytreatmentplanPageModule'
            },
            {
                path: 'tab3/mytreatmentplan/edit',
                loadChildren: '../mytreatmentplan/edit/edit.module#EditPageModule'
            },
            { path: 'h', loadChildren: '../onboard/onboard.module#OnboardPageModule' },
            { path: 'check-profile', loadChildren: '../check-profile/check-profile.module#CheckProfilePageModule' },
            {
                path: '',
                redirectTo: '/tabs/tab1',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/check-profile',
        pathMatch: 'full'
    }
];
var TabsPageRoutingModule = /** @class */ (function () {
    function TabsPageRoutingModule() {
    }
    TabsPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            exports: [RouterModule]
        })
    ], TabsPageRoutingModule);
    return TabsPageRoutingModule;
}());
export { TabsPageRoutingModule };
//# sourceMappingURL=tabs.router.module.js.map