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
                return Results.BadRequest("username აუცილებელია");

            if (string.IsNullOrWhiteSpace(req.FirstName) || string.IsNullOrWhiteSpace(req.LastName))
                return Results.BadRequest("სახელი და გვარი აუცილებელია");

            if (string.IsNullOrWhiteSpace(req.Password) || req.Password.Length < 6)
                return Results.BadRequest("პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო");

            var username = req.Username.Trim();

            bool exists = await db.Users.AnyAsync(u => u.Username == username);
            if (exists)
                return Results.Conflict("ეს username უკვე დაკავებულია");

            var user = new User
            {
                Username = username,
                FirstName = req.FirstName.Trim(),
                LastName = req.LastName.Trim(),
                BirthDate = req.BirthDate,
                TechStack = req.TechStack,
                Level = req.Level,
                ZodiacSign = ZodiacService.GetSign(req.BirthDate),
                PasswordHash = PasswordHasher.Hash(req.Password)
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return Results.Created($"/api/users/{user.Id}", user);
        });

        app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db, HttpContext ctx) =>
        {
            if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrEmpty(req.Password))
                return Results.BadRequest("შეიყვანე username და პაროლი");

            var username = req.Username.Trim();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user is null)
                return Results.Text("არასწორი username ან პაროლი", statusCode: 401);

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                user.PasswordHash = PasswordHasher.Hash(req.Password);
                await db.SaveChangesAsync();
            }
            else if (!PasswordHasher.Verify(req.Password, user.PasswordHash))
            {
                return Results.Text("არასწორი username ან პაროლი", statusCode: 401);
            }

            ctx.Session.SetInt32("userId", user.Id);
            return Results.Ok(user);
        });

        app.MapGet("/api/auth/me", async (AppDbContext db, HttpContext ctx) =>
        {
            var userId = ctx.Session.GetInt32("userId");
            if (userId is null)
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId.Value);
            if (user is null)
                return Results.Unauthorized();

            return Results.Ok(user);
        });

        app.MapPost("/api/auth/logout", (HttpContext ctx) =>
        {
            ctx.Session.Clear();
            return Results.Ok();
        });
    }
}