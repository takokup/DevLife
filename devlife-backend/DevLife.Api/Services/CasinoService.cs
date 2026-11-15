using DevLife.Api.Data;
using DevLife.Api.Dtos;
using DevLife.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Driver;

namespace DevLife.Api.Services;

public class CasinoService
{
    private readonly AppDbContext _db;
    private readonly MongoContext _mongo;
    private readonly IMemoryCache _cache;

    private record RoundState(int UserId, string ChallengeId, string CorrectChoice, bool IsDaily);

    public CasinoService(AppDbContext db, MongoContext mongo, IMemoryCache cache)
    {
        _db = db;
        _mongo = mongo;
        _cache = cache;
    }

    public static double GetLuckMultiplier(string zodiacSign)
    {
        int seed = DateTime.UtcNow.DayOfYear + zodiacSign.Sum(c => c);
        return 1.0 + (seed % 6) * 0.1;
    }

    public async Task<RoundResponse> StartRound(User user)
    {
        int difficulty;
        if (user.CurrentStreak < 3) difficulty = 1;
        else if (user.CurrentStreak < 6) difficulty = 2;
        else difficulty = 3;

        var challenges = await _mongo.Challenges
            .Find(c => c.Stack == user.TechStack && c.Difficulty == difficulty)
            .ToListAsync();

        if (challenges.Count == 0)
            challenges = await _mongo.Challenges.Find(c => c.Stack == user.TechStack).ToListAsync();

        if (challenges.Count == 0)
            challenges = await _mongo.Challenges.Find(_ => true).ToListAsync();

        var challenge = challenges[Random.Shared.Next(challenges.Count)];
        string correctChoice = Random.Shared.Next(2) == 0 ? "A" : "B";

        return CreateRound(user, challenge, correctChoice, false);
    }

    public async Task<(RoundResponse? Response, string? Error)> StartDailyRound(User user)
    {
        var todayStart = DateTime.UtcNow.Date;
        bool alreadyPlayed = await _db.GameRounds
            .AnyAsync(g => g.UserId == user.Id && g.IsDaily && g.PlayedAt >= todayStart);

        if (alreadyPlayed)
            return (null, "დღეს უკვე ითამაშე");

        var all = await _mongo.Challenges.Find(_ => true).ToListAsync();
        if (all.Count == 0)
            return (null, "challenge-ები ვერ მოიძებნა");

        var ordered = all.OrderBy(c => c.Id).ToList();
        int day = DateTime.UtcNow.DayOfYear;
        var challenge = ordered[day % ordered.Count];
        string correctChoice = day % 2 == 0 ? "A" : "B";

        return (CreateRound(user, challenge, correctChoice, true), null);
    }

    private RoundResponse CreateRound(User user, CodeChallenge challenge, string correctChoice, bool isDaily)
    {
        string snippetA = correctChoice == "A" ? challenge.CorrectCode : challenge.BuggyCode;
        string snippetB = correctChoice == "A" ? challenge.BuggyCode : challenge.CorrectCode;

        var roundId = Guid.NewGuid().ToString();
        _cache.Set(roundId, new RoundState(user.Id, challenge.Id!, correctChoice, isDaily), TimeSpan.FromMinutes(2));

        return new RoundResponse(roundId, snippetA, snippetB, challenge.Stack, challenge.Difficulty,
            GetLuckMultiplier(user.ZodiacSign), isDaily);
    }

    public async Task<(BetResponse? Response, string? Error)> PlaceBet(User user, BetRequest req)
    {
        if (req.Choice != "A" && req.Choice != "B")
            return (null, "არასწორი არჩევანი");

        if (req.Amount <= 0)
            return (null, "ფსონი უნდა იყოს დადებითი");

        if (req.Amount > user.Points)
            return (null, "არასაკმარისი ქულები");

        if (string.IsNullOrEmpty(req.RoundId))
            return (null, "roundId აუცილებელია");

        if (!_cache.TryGetValue(req.RoundId, out RoundState? state) || state is null)
            return (null, "რაუნდი ვერ მოიძებნა ან ვადა გაუვიდა");

        if (state.UserId != user.Id)
            return (null, "ეს რაუნდი შენი არ არის");

        _cache.Remove(req.RoundId);

        bool isWin = req.Choice == state.CorrectChoice;
        double multiplier = 2 * GetLuckMultiplier(user.ZodiacSign);
        if (state.IsDaily) multiplier *= 1.5;

        int pointsChange = isWin ? (int)Math.Round(req.Amount * multiplier) : -req.Amount;

        user.Points += pointsChange;
        if (isWin)
        {
            user.CurrentStreak++;
            user.BestStreak = Math.Max(user.BestStreak, user.CurrentStreak);
        }
        else
        {
            user.CurrentStreak = 0;
        }

        _db.GameRounds.Add(new GameRound
        {
            UserId = user.Id,
            User = user,
            ChallengeId = state.ChallengeId,
            BetAmount = req.Amount,
            IsWin = isWin,
            PointsChange = pointsChange,
            IsDaily = state.IsDaily
        });
        await _db.SaveChangesAsync();

        var challenge = await _mongo.Challenges
            .Find(c => c.Id == state.ChallengeId)
            .FirstOrDefaultAsync();

        var response = new BetResponse(
            isWin,
            pointsChange,
            user.Points,
            user.CurrentStreak,
            state.CorrectChoice,
            challenge?.Explanation ?? "");

        return (response, null);
    }
}