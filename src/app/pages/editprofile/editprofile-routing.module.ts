import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditprofilePage } from './editprofile.page';

const routes: Routes = [
  {
    path: '',
    component: EditprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditprofilePageRoutingModule {kk
}
