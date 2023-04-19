using System;
using Stripe;

namespace PaymentApi.Services
{
    public interface IStripeClient
    {
        Task<string> CreateCustomerAsync(
           string firstName,
           string lastName,
           string email,
           string? taxId);

        Task<string> CreateSetupIntentAsync(
            string customerId,
            Dictionary<string, string>? metadata);
    }

    public class StripeClient : IStripeClient
    {
        private IConfiguration configuration;
        private RequestOptions requestOptions;

        private const string _taxIdTypeVat = "ua_vat";
        private const string _cardPaymentMethod = "card";
        private const string _offSessionUssage = "off_session";

        public StripeClient(IConfiguration configuration)
        {
            this.configuration = configuration;
            this.requestOptions = new RequestOptions { ApiKey = configuration["Stripe:ApiKey"] };
        }

        public async Task<string> CreateCustomerAsync(string firstName, string lastName, string email, string? taxId)
        {
            //TODO: check what tax id we need
            var taxInfo = new CustomerTaxIdDataOptions { Type = _taxIdTypeVat, Value = taxId};
            var customerCreateOptions = new CustomerCreateOptions
            {
                Description = $"{firstName} {lastName}",
                Email = email,
                Name = $"{firstName} {lastName}",
                TaxIdData = new List<CustomerTaxIdDataOptions> { }
            };

            var service = new CustomerService();

            var customer = await service.CreateAsync(customerCreateOptions, requestOptions);

            return customer.Id;
        }

        public async Task<string> CreateSetupIntentAsync(string customerId, Dictionary<string, string>? metadata)
        {
            var setupIntentCreateOptions = new SetupIntentCreateOptions
            {
                Customer = customerId,
                PaymentMethodTypes = new List<string> { _cardPaymentMethod },
                Usage = _offSessionUssage,
                Metadata = metadata
            };

            var setupIntentService = new SetupIntentService();

            var setupIntent = await setupIntentService.CreateAsync(setupIntentCreateOptions, requestOptions);

            return setupIntent.ClientSecret;
        }
    }
}

