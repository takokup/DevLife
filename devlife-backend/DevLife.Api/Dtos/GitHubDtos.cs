namespace DevLife.Api.Dtos;

public record RepoInfo(string Owner, string Name, string Description, string Language, int Stars);

public record AnalyzeRequest(string Owner, string Repo);

public record MetricsInfo(
    int CommitsChecked,
    int AvgCommitLength,
    int ConventionalPercent,
    int CommentPercent,
    string NamingStyle,
    bool HasReadme,
    string TopLanguage,
    int FileCount);

public record PersonalityResponse(
    string Owner,
    string Repo,
    string Personality,
    string Emoji,
    string Description,
    List<string> Strengths,
    List<string> Weaknesses,
    List<string> Celebrities,
    MetricsInfo Metrics);