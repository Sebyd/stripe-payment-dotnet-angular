using System;
namespace PaymentApi.Services.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddStripeClient(this IServiceCollection services)
        {
            services.AddTransient<IStripeClient, StripeClient>();

            return services;
        }
    }
}

