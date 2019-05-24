import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OnboardothermedsPage } from './onboardothermeds.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardothermedsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OnboardothermedsPage]
})
export class OnboardothermedsPageModule {}
