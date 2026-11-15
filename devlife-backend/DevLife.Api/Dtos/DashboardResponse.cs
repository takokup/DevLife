namespace DevLife.Api.Dtos;

public record DashboardResponse(
    string Greeting,
    string ZodiacSign,
    string Horoscope,
    string LuckyTechnology);