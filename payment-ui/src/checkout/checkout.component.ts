import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, fromEvent, take, takeUntil } from 'rxjs';
import { IPaymentSetupIntentResponse } from 'src/payments/payment';
import { PaymentApiService } from 'src/payments/payment-api.service';

declare var Stripe: any;

const CLIENT_KEY =
  'pk_test_51KgR72D7nFW2h6dfN3zQqJgA6y92k8XoOU5KPMyPYxE106gcJ8dS9sOOvyn2ckvpaukGe9T3FBuK27WLumsI3AKu00wc7M0Bwn';
const ACCOUNT_ID = 'acct_1KgR72D7nFW2h6df';

const CHECKOUT_APPEARANCE = {
  theme: 'night',

  rules: {
    '.Input:focus': {
      outline: 'none',
      borderColor: '#0d203f',
      boxShadow:
        '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 1px 1px rgba(18, 42, 66, 0.02), 0 0 0 1px #0d203f',
    },
  },

  variables: {
    colorPrimary: '#0d203f',
    colorBackground: '#18d1a5',
    colorText: 'white',
    spacingUnit: '4px',
    borderRadius: '4px',
  },
};

@Component({
  selector: 'checkout-component',
  templateUrl: 'checkout.component.html',
  styleUrls: ['checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public stripeInstance = Stripe(CLIENT_KEY, {
    stripeAccount: ACCOUNT_ID,
  });

  public elements?: any;

  public isPageLoading = true;
  public errorWhenAttemptingSubmit: string | undefined = undefined;

  private destroyNotifier = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paymentApiService: PaymentApiService
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroyNotifier))
      .subscribe(async (params) => {
        const { redirect_status } = params;

        this.redirectIfCheckoutIsComplete(redirect_status);

        const selectedPlanId = params['planId'];
        this.createSetupIntentAndInitStripe(selectedPlanId);
      });
  }

  public async submitAttempt(): Promise<void> {
    const return_url = window.location.href.split('?')[0];

    const errorObj = await this.stripeInstance.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements: this.elements,
      confirmParams: {
        return_url,
      },
    });

    if (errorObj && errorObj.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      this.errorWhenAttemptingSubmit = errorObj.error.message;
    }
  }

  private createSetupIntentAndInitStripe(selectedPlanId: string): void {
    const userId = '';

    this.paymentApiService
      .createSetupIntent(userId, selectedPlanId)
      .subscribe(async (payment) => this.initStripePayment(payment));
  }

  public initStripePayment(paymentIntent: IPaymentSetupIntentResponse) {
    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
    const elements = this.stripeInstance.elements({
      clientSecret: paymentIntent.clientSecret,
      appearance: CHECKOUT_APPEARANCE,
    });

    // Create and mount the Payment Element
    const paymentElement = elements.create('payment');
    paymentElement.mount('#paymentContainer');

    this.elements = elements;

    fromEvent(this.elements.getElement('payment') as any, 'change')
      .pipe(take(1))
      .subscribe((_) => (this.isPageLoading = false));
  }

  private redirectIfCheckoutIsComplete(redirectStatus: string): void {
    if (redirectStatus !== 'succeeded' && redirectStatus !== 'failed') {
      return;
    }

    this.router.navigate([redirectStatus], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute,
    });
    return;
  }

  public ngOnDestroy(): void {
    this.destroyNotifier.next();
    this.destroyNotifier.complete();
  }
}
