import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditprofilePageRoutingModule } from './editprofile-routing.module';

import { EditprofilePage } from './editprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditprofilePageRoutingModule
  ],
  declarations: [EditprofilePage]
})
export class EditprofilePageModule {
}
