namespace API.Middleware
{
    public static class EncryptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseEncryptionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<EncryptionMiddleware>();
        }
    }
}
