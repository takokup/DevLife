using DevLife.Api.Data;
using DevLife.Api.Endpoints;
using DevLife.Api.Hubs;
using DevLife.Api.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

builder.Services.AddSingleton<MongoContext>();

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis")!));

builder.Services.AddMemoryCache();
builder.Services.AddScoped<CasinoService>();
builder.Services.AddScoped<DatingService>();
builder.Services.AddSingleton<ExcuseService>();
builder.Services.AddSingleton<FavoriteService>();
builder.Services.AddHttpClient<RoastService>();
builder.Services.AddHttpClient<GroqService>();
builder.Services.AddHttpClient<GitHubService>();
builder.Services.AddSignalR();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(o =>
{
    o.IdleTimeout = TimeSpan.FromHours(2);
    o.Cookie.HttpOnly = true;
    o.Cookie.IsEssential = true;
});

var app = builder.Build();

SeedData.Seed(app.Services.GetRequiredService<MongoContext>());
SeedTasks.Seed(app.Services.GetRequiredService<MongoContext>());
SeedProfiles.Seed(app.Services.GetRequiredService<MongoContext>());

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSession();

app.MapAuthEndpoints();
app.MapDashboardEndpoints();
app.MapCasinoEndpoints();
app.MapExcuseEndpoints();
app.MapRoastEndpoints();
app.MapBugChaseEndpoints();
app.MapGitHubEndpoints();
app.MapDatingEndpoints();
app.MapHub<GameHub>("/hubs/game");

app.Run();