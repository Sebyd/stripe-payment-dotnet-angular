using System;
namespace PaymentApi.Common.Api
{
    public class ApiResponse
    {
        public string Value { get; init; }

        public ApiResponse(string value)
        {
            Value = value;
        }
    }
}

