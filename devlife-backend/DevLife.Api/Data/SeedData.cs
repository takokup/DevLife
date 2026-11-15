using System.Collections.ObjectModel;
using DevLife.Api.Models;
using Microsoft.VisualBasic;
using MongoDB.Driver;

namespace DevLife.Api.Data;

public static class SeedData
{
    public static void Seed(MongoContext mongo)
    {

       if(mongo.Challenges.CountDocuments(_ => true) > 0)return;
          var challenges = new List<CodeChallenge>
        {new CodeChallenge
    {
        Stack = ".NET",
        Difficulty = 1,
        CorrectCode = "int x = 10;",
        BuggyCode = "int x = 10",
        Explanation = "; დაკარგვა ხაზის ბოლოში."
    },
        new CodeChallenge
    {
        Stack = ".NET",
        Difficulty = 1,
        CorrectCode = "Console.WriteLine(name);",
        BuggyCode = "Console.WriteLine(name;",
        Explanation = "დახურული ფრჩხილის დაკარგვა."
    },
    new CodeChallenge
    {
        Stack = ".NET",
        Difficulty = 2,
        CorrectCode = "string text = \"Hello\";",
        BuggyCode = "string text = Hello;",
        Explanation = "სტრიქონის ბრჭყალებში ჩასმა დაავიწყდა."
    },
    new CodeChallenge
    {
        Stack = ".NET",
        Difficulty = 3,
        CorrectCode = "int result = int.Parse(input);",
        BuggyCode = "int result = int.parse(input);",
        Explanation = "Case-sensitive შეცდომა."
    }};
        mongo.Challenges.InsertMany(challenges);
            
    }
}