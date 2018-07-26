import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactTeamComponent } from './contact-team.component';

const routes: Routes = [
    { path: '', component: ContactTeamComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ContactTeamRoutingModule {}