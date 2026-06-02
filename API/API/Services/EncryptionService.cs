using System.Text.Json;

namespace API.Services
{
    public interface IEncryptionService
    {
        string DecryptString(string encryptedData);
        string EncryptData(object data);
    }

    public class EncryptionService : IEncryptionService
    {
        private readonly ILogger<EncryptionService> _logger;

        public EncryptionService(ILogger<EncryptionService> logger)
        {
            _logger = logger;
        }

        public string DecryptString(string encryptedData)
        {
            // Placeholder: currently returns the input string.
            // Replace with actual decryption logic (e.g., AES-256) when keys are configured.
            _logger.LogInformation("Decryption placeholder called.");
            return encryptedData;
        }

        public string EncryptData(object data)
        {
            // Placeholder: currently serializes the object to JSON.
            // Replace with actual encryption logic (e.g., AES-256) when keys are configured.
            _logger.LogInformation("Encryption placeholder called.");
            return JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            });
        }
    }
}
