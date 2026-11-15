namespace DevLife.Api.Dtos;

public record DatingSetupRequest(string Gender, string LookingFor, string Bio);

public record DatingSetupResponse(string Gender, string LookingFor, string Bio);

public record DatingCard(string Id, string Name, int Age, string Emoji, string TechStack, string Bio, int Compatibility);

public record SwipeRequest(string ProfileId, bool Like);

public record MatchesResponse(List<DatingCard> Matches, int Pending);

public record ChatRequest(string ProfileId, string Message);

public record ChatMessage(string From, string Text);