using DevLife.Api.Data;
using DevLife.Api.Dtos;
using DevLife.Api.Models;
using DevLife.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace DevLife.Api.Endpoints;

public static class CasinoEndpoints
{
    private static async Task<User?> GetCurrentUser(HttpContext ctx, AppDbContext db)
    {
        var userId = ctx.Session.GetInt32("userId");
        return userId is null ? null : await db.Users.FindAsync(userId.Value);
    }

    public static void MapCasinoEndpoints(this WebApplication app)
    {
        app.MapGet("/api/casino/round", async (AppDbContext db, HttpContext ctx, CasinoService casino) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null) return Results.Unauthorized();

            return Results.Ok(await casino.StartRound(user));
        });

        app.MapGet("/api/casino/daily", async (AppDbContext db, HttpContext ctx, CasinoService casino) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null) return Results.Unauthorized();

            var (response, error) = await casino.StartDailyRound(user);
            return error is not null ? Results.BadRequest(error) : Results.Ok(response);
        });

        app.MapPost("/api/casino/bet", async (BetRequest req, AppDbContext db, HttpContext ctx, CasinoService casino) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null) return Results.Unauthorized();

            var (response, error) = await casino.PlaceBet(user, req);
            return error is not null ? Results.BadRequest(error) : Results.Ok(response);
        });

        app.MapGet("/api/casino/leaderboard", async (AppDbContext db, HttpContext ctx) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null) return Results.Unauthorized();

            var top = await db.Users
                .OrderByDescending(u => u.Points)
                .Take(10)
                .Select(u => new LeaderboardEntry(u.Username, u.ZodiacSign, u.Points, u.BestStreak))
                .ToListAsync();

            return Results.Ok(top);
        });
    }
}