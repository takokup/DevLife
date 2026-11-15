namespace DevLife.Api.Services;

public static class HoroscopeService
{
    private static readonly string[] Signs =
    {
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    };

    private static readonly string[] Emojis =
    {
        "♈", "♉", "♊", "♋", "♌", "♍",
        "♎", "♏", "♐", "♑", "♒", "♓"
    };

    private static readonly string[] Tips =
    {
        "git push --force-ს ნუ გააკეთებ.",
        "იმ bug-ს იპოვი, რომელსაც გუშინ ეძებდი.",
        "კარგი დღეა refactoring-ისთვის, ოღონდ ჯერ ტესტები დაწერე.",
        "code review-ზე გაგაკრიტიკებენ. ეს სიყვარულის ნიშანია.",
        "production-ზე არაფერი დადო, თუ ხუთშაბათია.",
        "ერთი სუფთა ფუნქცია ათ კომენტარს ღირს.",
        "ყავა გამოგადგება. ბევრი ყავა.",
        "რაღაც ახალს ისწავლი, თუნდაც ერთ სტატიას წაიკითხავ.",
        "კომპილატორი შენს მხარესაა, error-ები მისი ზრუნვაა.",
        "იმ TODO-ს, რომელსაც გუშინ წერდი, დღეს უნდა მიხედო."
    };

    private static readonly string[] LuckyTechnologies =
    {
        "React", ".NET", "Python", "TypeScript", "Rust",
        "Go", "PostgreSQL", "Docker", "Redis", "Git"
    };

    public static string GetEmoji(string sign) => Emojis[SignIndex(sign)];

    public static string GetDailyTip(string sign) =>
        Tips[(DayOfYear() + SignIndex(sign)) % Tips.Length];

    public static string GetLuckyTechnology(string sign) =>
        LuckyTechnologies[(DayOfYear() + SignIndex(sign) * 3) % LuckyTechnologies.Length];

    private static int SignIndex(string sign) => Math.Max(0, Array.IndexOf(Signs, sign));

    private static int DayOfYear() => DateTime.UtcNow.DayOfYear;
}