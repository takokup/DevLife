using DevLife.Api.Data;
using DevLife.Api.Dtos;
using DevLife.Api.Hubs;
using DevLife.Api.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DevLife.Api.Endpoints;

public static class BugChaseEndpoints
{
    private static readonly (int Score, string Name)[] Achievements =
    {
        (100, "🥉 ბაგების მონადირე"),
        (500, "🥈 Deadline-ის გამცურავი"),
        (1000, "🥇 უკვდავი სენიორი")
    };

    private static async Task<User?> GetCurrentUser(HttpContext ctx, AppDbContext db)
    {
        var userId = ctx.Session.GetInt32("userId");
        if (userId is null)
            return null;

        return await db.Users.FindAsync(userId.Value);
    }

    private static async Task<List<BugChaseEntry>> GetTopScores(AppDbContext db)
    {
        var rows = await db.BugChaseScores
            .GroupBy(s => s.User!.Username)
            .Select(g => new { Username = g.Key, BestScore = g.Max(s => s.Score) })
            .OrderByDescending(x => x.BestScore)
            .Take(10)
            .ToListAsync();

        return rows.Select(r => new BugChaseEntry(r.Username, r.BestScore)).ToList();
    }

    public static void MapBugChaseEndpoints(this WebApplication app)
    {
        app.MapGet("/api/bugchase/leaderboard", async (AppDbContext db, HttpContext ctx) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var top = await GetTopScores(db);
            return Results.Ok(top);
        });

        app.MapPost("/api/bugchase/score", async (ScoreRequest req, AppDbContext db, HttpContext ctx, IHubContext<GameHub> hub) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            if (req.Score < 0 || req.Score > 100000)
                return Results.BadRequest("არასწორი ქულა");

            bool hasPrevious = await db.BugChaseScores.AnyAsync(s => s.UserId == user.Id);
            int previousBest = 0;
            if (hasPrevious)
                previousBest = await db.BugChaseScores.Where(s => s.UserId == user.Id).MaxAsync(s => s.Score);

            var achievements = new List<string>();
            if (!hasPrevious)
                achievements.Add("პირველი გაქცევა");

            foreach (var a in Achievements)
            {
                if (previousBest < a.Score && req.Score >= a.Score)
                    achievements.Add(a.Name);
            }

            int pointsEarned = Math.Min(req.Score / 50, 50);
            user.Points += pointsEarned;

            db.BugChaseScores.Add(new BugChaseScore { UserId = user.Id, Score = req.Score });
            await db.SaveChangesAsync();

            var top = await GetTopScores(db);
            await hub.Clients.All.SendAsync("LeaderboardUpdated", top);

            int bestScore = Math.Max(previousBest, req.Score);
            return Results.Ok(new ScoreResponse(req.Score, bestScore, pointsEarned, user.Points, achievements));
        });
    }
}