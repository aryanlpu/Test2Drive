import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { AllJobsComponent } from  './all-jobs/all-jobs.component'
import { ProjectComponent } from './project.component';
import { OffersComponent } from './offers/offers.component';
import { AcceptedJobsComponent } from './accepted-jobs/accepted-jobs.component';
import { PreviousJobsComponent } from './previous-jobs/previous-jobs.component';
import { CancelledJobsComponent } from './cancelled-jobs/cancelled-jobs.component';
import { HiredJobsComponent } from "project/Hired/Hired-jobs.component";

const routes: Routes = [
//   {
//     path: '',
//     component: ProjectComponent
//   },
  {
    path: '',
    component: ProjectComponent,
    children: [{
      path: '',
      children: [
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: 'all', component: AllJobsComponent },
        { path: 'offers', component: OffersComponent },
        { path: 'accepted', component: AcceptedJobsComponent},
        { path: 'previous', component: PreviousJobsComponent},
        { path: 'cancelled', component: CancelledJobsComponent},
        { path: 'Hired', component: HiredJobsComponent}
      ]  
    }]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class ProjectRoutingModule {}