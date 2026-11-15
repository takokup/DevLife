namespace DevLife.Api.Dtos;

public record ExcuseResponse(string Id, string Category, string Type, string Text, int Believability);