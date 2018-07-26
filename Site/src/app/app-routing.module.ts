import { NgModule }               from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';
import { ChatConnectionResolver } from 'chat/connection.resolver';

export const routes: Routes = [
  { path: '', children: [
    { path: '', pathMatch: 'full', loadChildren: '../home/home.module#HomeModule' },
    { path: 'login', loadChildren: '../login/login.module#LoginModule' },
    { path: 'signup', loadChildren: '../signup/signup.module#SignupModule' },
    { path: 'about', loadChildren: '../about/about.module#AboutModule' },
    { path: 'contact', loadChildren: '../contact-team/contact-team.module#ContactTeamModule' },
    { path: 'search', loadChildren: '../search/search.module#SearchModule' },
    { path: 'profile', loadChildren: '../profile/profile.module#ProfileModule' },
    { path: 'privacy', loadChildren: '../legal/privacy/privacy.module#LegalPrivacyModule' },
    { path: 'terms', loadChildren: '../legal/terms/terms.module#LegalTermsModule' },
    { path: 'resetpassword', loadChildren: '../reset-password/reset.password.module#ResetPasswordModule' },
    { path: 'project', loadChildren: '../project/project.module#ProjectModule' },
    { path: 'hire', loadChildren: '../payment-screen/payment.screen.module#PaymentScreenModule'},
    { path: 'maintenance', loadChildren: '../maintenance/maintenance.module#MaintenanceModule' }
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
