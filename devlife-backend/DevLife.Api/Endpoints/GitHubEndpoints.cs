using DevLife.Api.Dtos;
using DevLife.Api.Services;

namespace DevLife.Api.Endpoints;

public static class GitHubEndpoints
{
    public static void MapGitHubEndpoints(this WebApplication app)
    {
        app.MapGet("/api/github/repos", async (string username, HttpContext ctx, GitHubService github) =>
        {
            if (ctx.Session.GetInt32("userId") is null)
                return Results.Unauthorized();

            if (string.IsNullOrWhiteSpace(username))
                return Results.BadRequest("შეიყვანე GitHub username");

            var (repos, error) = await github.GetRepos(username.Trim());
            if (error is not null)
                return Results.BadRequest(error);

            return Results.Ok(repos);
        });

        app.MapPost("/api/github/analyze", async (AnalyzeRequest req, HttpContext ctx, GitHubService github) =>
        {
            if (ctx.Session.GetInt32("userId") is null)
                return Results.Unauthorized();

            var (response, error) = await github.Analyze(req);
            if (error is not null)
                return Results.BadRequest(error);

            return Results.Ok(response);
        });
    }
}