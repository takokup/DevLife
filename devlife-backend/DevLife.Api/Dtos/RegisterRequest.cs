namespace DevLife.Api.Dtos;

public record RegisterRequest(
    string Username,
    string FirstName,
    string LastName,
    DateOnly BirthDate,
    string TechStack,
    string Level);