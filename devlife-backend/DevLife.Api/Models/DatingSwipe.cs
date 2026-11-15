namespace DevLife.Api.Models;

public class DatingSwipe
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ProfileId { get; set; } = "";
    public bool Liked { get; set; }
    public bool IsMatch { get; set; }
    public DateTime MatchAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}