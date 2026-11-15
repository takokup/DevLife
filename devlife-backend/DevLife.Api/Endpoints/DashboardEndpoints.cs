using DevLife.Api.Data;
using DevLife.Api.Dtos;
using DevLife.Api.Services;

namespace DevLife.Api.Endpoints;

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this WebApplication app)
    {
        app.MapGet("/api/dashboard", async (AppDbContext db, HttpContext ctx) =>
        {
            var userId = ctx.Session.GetInt32("userId");
            if (userId is null)
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId.Value);
            if (user is null)
                return Results.Unauthorized();

            var emoji = HoroscopeService.GetEmoji(user.ZodiacSign);
            var tip = HoroscopeService.GetDailyTip(user.ZodiacSign);
            var lucky = HoroscopeService.GetLuckyTechnology(user.ZodiacSign);

            var greeting = $"გამარჯობა {user.FirstName}! {emoji} {user.ZodiacSign}, დღეს {tip}";

            return Results.Ok(new DashboardResponse(greeting, user.ZodiacSign, tip, lucky));
        });
    }
}