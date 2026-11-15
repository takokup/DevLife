namespace DevLife.Api.Dtos;

public record ScoreRequest(int Score);

public record ScoreResponse(int Score, int BestScore, int PointsEarned,
     int NewBalance, List<string> Achievements);

public record BugChaseEntry(string Username, int BestScore);