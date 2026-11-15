namespace DevLife.Api.Dtos;

public record RegisterRequest(
    string Username,
    string FirstName,
    string LastName,
    string Password,
    DateOnly BirthDate,
    string TechStack,
    string Level);