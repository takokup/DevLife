namespace DevLife.Api.Models;

public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    public DateOnly BirthDate { get; set; }
    public required string TechStack { get; set; }
    public required string Level { get; set; }

    public required string ZodiacSign { get; set; }
}