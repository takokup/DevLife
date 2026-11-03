using DevLife.Api.Data;
using DevLife.Api.Dtos;
using DevLife.Api.Models;
using DevLife.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace DevLife.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        app.MapPost("/api/auth/register", async (RegisterRequest req, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(req.Username))
                return Results.BadRequest("Username is required");

            if (await db.Users.AnyAsync(u => u.Username == req.Username))
                return Results.Conflict("Username already taken");

            var user = new User
            {
                Username = req.Username,
                FirstName = req.FirstName,
                LastName = req.LastName,
                BirthDate = req.BirthDate,
                TechStack = req.TechStack,
                Level = req.Level,
                ZodiacSign = ZodiacService.GetSign(req.BirthDate)
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return Results.Created($"/api/users/{user.Id}", user);
        });

        app.MapPost("/api/auth/login", async (LoginRequest req,AppDbContext db, HttpContext ctx) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
            if(user is null)
                return Results.NotFound("User not found");
            
            ctx.Session.SetInt32("userId", user.Id);
            return Results.Ok(user);
        });

        app.MapGet("/api/auth/me", async(AppDbContext db, HttpContext ctx) =>
        {
            var userId = ctx.Session.GetInt32("userId");
            if(userId is null)
            return Results.Unauthorized();
            
            var user = await db.Users.FindAsync(userId.Value);
            return user is null ? Results.Unauthorized():Results.Ok(user);
        });

        app.MapPost("/api/auth/logout", (HttpContext ctx) => 
        {
            ctx.Session.Clear();
            return Results.Ok();
            
        });
    }
}