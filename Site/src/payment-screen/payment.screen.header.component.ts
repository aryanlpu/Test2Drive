import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteHeaderComponent } from 'shared/components/site-header/site-header.component';

@Component({
    selector: 'ij-payment-screen-header',
    templateUrl: './payment.screen.header.component.html'
})
export class PaymentScreenHeaderComponent {
    @ViewChild("siteHeader") siteHeader: SiteHeaderComponent;
    constructor() { }
}
