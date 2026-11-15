namespace DevLife.Api.Dtos;

public record RoundResponse(string RoundId, string SnippetA, string SnippetB, 
    string Stack, int Difficulty, double LuckMultiplier, bool IsDaily);

public record LeaderboardEntry(string Username, string ZodiacSign, int Points, int BestStreak);
public record BetRequest(string RoundId, string Choice, int Amount);

public record BetResponse(bool IsWin, int PointsChange, 
    int NewBalance, int CurrentStreak, 
    string CorrectChoice, string Explanation);