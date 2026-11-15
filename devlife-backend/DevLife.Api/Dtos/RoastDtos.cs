namespace DevLife.Api.Dtos;

public record TaskResponse(string Id, string Title, 
    string Description, string StarterCode, string Language, int Difficulty);

public record RoastRequest(string TaskId, string Code);

public record RoastResponse(bool IsCorrect, int Score, 
    string Roast, string Tip, int PointsEarned, int NewBalance);