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
    }
}