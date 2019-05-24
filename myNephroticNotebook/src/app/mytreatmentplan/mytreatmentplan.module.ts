import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MytreatmentplanPage } from './mytreatmentplan.page';

const routes: Routes = [
  {
    path: '',
    component: MytreatmentplanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MytreatmentplanPage]
})
export class MytreatmentplanPageModule {}
