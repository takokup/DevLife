using DevLife.Api.Data;
using DevLife.Api.Dtos;
using DevLife.Api.Models;
using DevLife.Api.Services;

namespace DevLife.Api.Endpoints;

public static class RoastEndpoints
{
    private static async Task<User?> GetCurrentUser(HttpContext ctx, AppDbContext db)
    {
        var userId = ctx.Session.GetInt32("userId");
        if (userId is null)
            return null;

        return await db.Users.FindAsync(userId.Value);
    }

    public static void MapRoastEndpoints(this WebApplication app)
    {
        app.MapGet("/api/roast/task", async (int difficulty, AppDbContext db, HttpContext ctx, RoastService roast) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            if (difficulty < 1 || difficulty > 3)
                return Results.BadRequest("სირთულე უნდა იყოს 1-დან 3-მდე");

            var task = await roast.GetTask(user, difficulty);
            if (task is null)
                return Results.NotFound("დავალება ვერ მოიძებნა");

            return Results.Ok(task);
        });

        app.MapPost("/api/roast/submit", async (RoastRequest req, AppDbContext db, HttpContext ctx, RoastService roast) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var (response, error) = await roast.Roast(user, req);
            if (error is not null)
                return Results.BadRequest(error);

            return Results.Ok(response);
        });
    }
}