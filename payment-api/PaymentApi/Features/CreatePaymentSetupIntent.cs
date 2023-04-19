using System;
using Microsoft.AspNetCore.Mvc;
using PaymentApi.Common.Api;

namespace PaymentApi.Features
{
    public class CreatePaymentSetupIntent
    {
        public class Command : IRequest<ApiResponse>
        {
            public string UserId { get; set; } = default!;
            public string PlanId { get; set; } = default!;
        }

        public class CommandHandler : IRequestHandler<CreatePaymentSetupIntent.Command, ApiResponse>
        {
            public Task<ApiResponse> Handle(Command request, CancellationToken cancellationToken)
            {
                return Task.FromResult(new ApiResponse("To be implemented"));
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

