using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using PaymentApi.Common.Api;
using PaymentApi.Services;

namespace PaymentApi.Features
{
    public class CreatePaymentSetupIntent
    {
        public class Command : IRequest<ApiResponse>
        {
            public string UserId { get; set; } = default!;
            public string UserFirstName { get; set; } = default!;
            public string UserLastName { get; set; } = default!;
            public string UserEmail { get; set; } = default!;
            public string? UserTaxId { get; set; }

            public string PlanId { get; set; } = default!;
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                //RuleFor(x => x.UserId)
                //    .NotEmpty();

                //RuleFor(x => x.UserFirstName)
                //   .NotEmpty();

                //RuleFor(x => x.UserLastName)
                //   .NotEmpty();

                //RuleFor(x => x.UserEmail)
                //    .NotEmpty();

                //RuleFor(x => x.PlanId)
                //    .NotEmpty();
            }
        }

        public class CommandHandler : IRequestHandler<Command, ApiResponse>
        {
            private IStripeClient stripeClient;

            public CommandHandler(IStripeClient stripeClient)
            {
                this.stripeClient = stripeClient;
            }

            public async Task<ApiResponse> Handle(Command request, CancellationToken cancellationToken)
            {
                //Create customer only if not exists
                //TODO: get this from db first

                var customerId = await stripeClient.CreateCustomerAsync(request.UserFirstName, request.UserLastName, request.UserEmail, request.UserTaxId);

                var clientSecretForPaymentSetup = await stripeClient.CreateSetupIntentAsync(customerId, metadata: null);

                return new ApiResponse(clientSecretForPaymentSetup);
            }
        }
    }

    [Route("api/payment-setup")]
    public class Controller : ControllerBase
    {
        private IMediator mediator;

        public Controller(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<ApiResponse> CreateSetupIntent()
        {
            var command = new CreatePaymentSetupIntent.Command();

            return await mediator.Send(command);
        }
    }
}

