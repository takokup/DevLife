using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

namespace DevLife.Api.Models;

public class GameRound
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required User User { get; set; }
    public required string ChallengeId { get; set; }
    public required int BetAmount { get; set; }
    public bool IsWin { get; set; }
    public int PointsChange { get; set; }
    public bool IsDaily { get; set; }
    public DateTime PlayedAt { get; set; }  = DateTime.UtcNow;
}