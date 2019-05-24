import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OnboardtreatmentplanPage } from './onboardtreatmentplan.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardtreatmentplanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OnboardtreatmentplanPage]
})
export class OnboardtreatmentplanPageModule {}
