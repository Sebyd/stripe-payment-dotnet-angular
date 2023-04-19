import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutSuccededComponent } from './succeded/checkout-succeded.component';
import { CheckoutFailedComponent } from './failed/checkout-failed.component';

const routes: Routes = [
  { path: '', component: CheckoutComponent },
  { path: 'succeeded', component: CheckoutSuccededComponent },
  { path: 'failed', component: CheckoutFailedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}

@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutSuccededComponent,
    CheckoutFailedComponent,
  ],
  imports: [CommonModule, CheckoutRoutingModule],
})
export class CheckoutModule {}
