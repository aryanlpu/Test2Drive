
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { PaymentScreenComponent } from "./payment.screen.component";
import { PaymentScreenHeaderComponent } from "./payment.screen.header.component";
import { HireComponent } from "./hire/hire.component";
import { PaymentStatusComponent } from "./payment-status/payment.status.component";



  const routes: Routes = [
    //   {
    //     path: '',
    //     component: AcceptHireComponent
    //   },
      {
        path: '',
        component: PaymentScreenComponent,
        children: [{
          path: '',
          children: [
            { path: '', redirectTo: 'All', pathMatch: 'full' },
            { path: 'All', component: HireComponent },
            { path: 'payment-status', component: PaymentStatusComponent },
          ]  
        }]
      }
    ];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class PaymentScreenRoutingModule {}
