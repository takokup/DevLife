using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace DevLife.Api.Services;

public class GroqService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    public GroqService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _config = config;
    }

    public async Task<JsonDocument?> AskJson(string systemPrompt, string userPrompt)
    {
        var apiKey = _config["Groq:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            return null;

        var model = _config["Groq:Model"] ?? "openai/gpt-oss-120b";

        var body = new
        {
            model = model,
            response_format = new { type = "json_object" },
            messages = new object[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            }
        };

        try
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.groq.com/openai/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            request.Content = JsonContent.Create(body);

            var response = await _http.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Groq error: " + errorText);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return JsonDocument.Parse(content!);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Groq error: " + ex.Message);
            return null;
        }
    }
}