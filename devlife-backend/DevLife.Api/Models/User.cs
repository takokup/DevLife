using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using System.Text.Json.Serialization;
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

    [JsonIgnore]
    public string PasswordHash { get; set; } = "";

    public required string ZodiacSign { get; set; }

    public int Points { get; set; } = 100;
    public int CurrentStreak { get; set; }
    public int BestStreak { get; set; }


}