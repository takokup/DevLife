using DevLife.Api.Data;
using DevLife.Api.Dtos;
using DevLife.Api.Models;
using DevLife.Api.Services;

namespace DevLife.Api.Endpoints;

public static class DatingEndpoints
{
    private static async Task<User?> GetCurrentUser(HttpContext ctx, AppDbContext db)
    {
        var userId = ctx.Session.GetInt32("userId");
        if (userId is null)
            return null;

        return await db.Users.FindAsync(userId.Value);
    }

    public static void MapDatingEndpoints(this WebApplication app)
    {
        app.MapGet("/api/dating/setup", async (AppDbContext db, HttpContext ctx, DatingService dating) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var setup = await dating.GetSetup(user.Id);
            if (setup is null)
                return Results.NotFound();

            return Results.Ok(setup);
        });

        app.MapPost("/api/dating/setup", async (DatingSetupRequest req, AppDbContext db, HttpContext ctx, DatingService dating) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var (response, error) = await dating.SaveSetup(user.Id, req);
            if (error is not null)
                return Results.BadRequest(error);

            return Results.Ok(response);
        });

        app.MapGet("/api/dating/next", async (AppDbContext db, HttpContext ctx, DatingService dating) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var (card, error) = await dating.GetNextCard(user);
            if (error is not null)
                return Results.BadRequest(error);

            if (card is null)
                return Results.NotFound();

            return Results.Ok(card);
        });

        app.MapPost("/api/dating/swipe", async (SwipeRequest req, AppDbContext db, HttpContext ctx, DatingService dating) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var error = await dating.Swipe(user, req);
            if (error is not null)
                return Results.BadRequest(error);

            return Results.Ok();
        });

        app.MapGet("/api/dating/matches", async (AppDbContext db, HttpContext ctx, DatingService dating) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var matches = await dating.GetMatches(user);
            return Results.Ok(matches);
        });

        app.MapGet("/api/dating/chat/{profileId}", async (string profileId, AppDbContext db, HttpContext ctx, DatingService dating) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var history = await dating.GetHistory(user.Id, profileId);
            return Results.Ok(history);
        });

        app.MapPost("/api/dating/chat", async (ChatRequest req, AppDbContext db, HttpContext ctx, DatingService dating) =>
        {
            var user = await GetCurrentUser(ctx, db);
            if (user is null)
                return Results.Unauthorized();

            var (reply, error) = await dating.Chat(user, req);
            if (error is not null)
                return Results.BadRequest(error);

            return Results.Ok(reply);
        });
    }
}