using DevLife.Api.Dtos;
using DevLife.Api.Services;

namespace DevLife.Api.Endpoints;

public static class ExcuseEndpoints
{
    public static void MapExcuseEndpoints(this WebApplication app)
    {
        app.MapGet("/api/excuses/generate", (string category, string type, HttpContext ctx, ExcuseService service) =>
        {
            var userId = ctx.Session.GetInt32("userId");
            if (userId is null)
                return Results.Unauthorized();

            var excuse = service.Generate(category, type);
            if (excuse is null)
                return Results.BadRequest("არასწორი კატეგორია ან ტიპი");

            return Results.Ok(excuse);
        });

        app.MapGet("/api/excuses/favorites", async (HttpContext ctx, FavoriteService favorites) =>
        {
            var userId = ctx.Session.GetInt32("userId");
            if (userId is null)
                return Results.Unauthorized();

            var list = await favorites.GetAll(userId.Value);
            return Results.Ok(list);
        });

        app.MapPost("/api/excuses/favorites", async (ExcuseResponse excuse, HttpContext ctx, FavoriteService favorites) =>
        {
            var userId = ctx.Session.GetInt32("userId");
            if (userId is null)
                return Results.Unauthorized();

            if (string.IsNullOrWhiteSpace(excuse.Id) || string.IsNullOrWhiteSpace(excuse.Text))
                return Results.BadRequest("საბაბი არასწორია");

            await favorites.Save(userId.Value, excuse);
            return Results.Ok();
        });

        app.MapDelete("/api/excuses/favorites/{id}", async (string id, HttpContext ctx, FavoriteService favorites) =>
        {
            var userId = ctx.Session.GetInt32("userId");
            if (userId is null)
                return Results.Unauthorized();

            await favorites.Remove(userId.Value, id);
            return Results.Ok();
        });
    }
}