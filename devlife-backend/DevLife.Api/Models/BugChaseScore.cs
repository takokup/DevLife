namespace DevLife.Api.Models;

public class BugChaseScore
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int Score { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
}