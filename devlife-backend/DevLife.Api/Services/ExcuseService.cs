using DevLife.Api.Dtos;

namespace DevLife.Api.Services;

public class ExcuseService
{
    private static readonly Dictionary<string, string> Meetings = new()
    {
        { "standup", "Daily standup-ზე" },
        { "sprint", "Sprint planning-ზე" },
        { "client", "კლიენტთან შეხვედრაზე" },
        { "team", "Team building-ზე" }
    };

    private static readonly string[] Things =
    {
        "ბაზა",
        "ავტორიზაციის სერვისი",
        "load balancer-ი",
        "CI/CD pipeline-ი",
        "DNS-ი",
        "Redis-ი"
    };

    private static readonly Dictionary<string, string[]> Templates = new()
    {
        {
            "technical", new[]
            {
                "{meeting} ვერ მოვალ, სერვერს ცეცხლი გაუჩნდა და production-ს ვარჩენ.",
                "{meeting} ვერ მოვალ, {thing} ჩამოვარდა და მთელი გუნდი ჩემს ლოდინშია.",
                "{meeting} დამაგვიანდება, ჩემს კომპიუტერზე Docker-მა მთელი მეხსიერება შეჭამა.",
                "{meeting} ვერ ვიქნები, ინტერნეტი გამითიშეს, რადგან {thing} გაფუჭდა.",
                "{meeting} ვერ მოვალ, hotfix-ს ვაკეთებ და ახლა თუ გავჩერდი, ყველაფერი დაიშლება."
            }
        },
        {
            "personal", new[]
            {
                "{meeting} ვერ მოვალ, კატამ production-ში შეაღწია.",
                "{meeting} ვერ მოვალ, კურიერი ზარს მირეკავს და ორივეს ვერ ვუპასუხებ.",
                "{meeting} დამაგვიანდება, დედაჩემს ლეპტოპის გამოყენებას ვასწავლი.",
                "{meeting} ვერ მოვალ, სანტექნიკოსი მოვიდა და სახლში წყალი დგას.",
                "{meeting} ვერ ვიქნები, ავტობუსში ჩემი ჩანთა დარჩა და ახლა მას ვეძებ."
            }
        },
        {
            "creative", new[]
            {
                "{meeting} ვერ მოვალ, AI-მ გააცნობიერა თავისი არსებობა და მჭირდება მისი დამშვიდება.",
                "{meeting} ვერ მოვალ, git-მა ჩემი წარსული დაივიწყა და ვცდილობ მის გახსენებას.",
                "{meeting} ვერ მოვალ, ერთმა bug-მა მითხრა, რომ მე ვარ მისი მამა.",
                "{meeting} ვერ მოვალ, დროის მანქანა შევქმენი და ახლა გუშინ ვარ.",
                "{meeting} ვერ მოვალ, rubber duck-ს ისეთი პრობლემა აქვს, რომ ვერ გავაწყვეტინებ."
            }
        }
    };

    public ExcuseResponse? Generate(string category, string type)
    {
        if (!Meetings.ContainsKey(category) || !Templates.ContainsKey(type))
            return null;

        var templates = Templates[type];
        var text = templates[Random.Shared.Next(templates.Length)];
        text = text.Replace("{meeting}", Meetings[category]);
        text = text.Replace("{thing}", Things[Random.Shared.Next(Things.Length)]);

        int score = 50;
        if (type == "technical") score = 70;
        if (type == "creative") score = 20;

        score = score + Random.Shared.Next(-10, 16);

        if (category == "client") score = score - 10;
        if (category == "standup") score = score + 5;

        score = Math.Clamp(score, 5, 95);

        return new ExcuseResponse(Guid.NewGuid().ToString(), category, type, text, score);
    }
}