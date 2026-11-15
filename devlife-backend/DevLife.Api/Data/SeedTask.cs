using DevLife.Api.Models;
using MongoDB.Driver;

namespace DevLife.Api.Data;

public static class SeedTasks
{
    public static void Seed(MongoContext mongo)
    {
        if (mongo.Tasks.CountDocuments(_ => true) > 0)
            return;

        var tasks = new List<CodingTask>
        {
            new CodingTask
            {
                Language = "JavaScript", Difficulty = 1, Title = "ჯამი",
                Description = "დაწერე ფუნქცია sum(numbers), რომელიც მასივის ყველა რიცხვის ჯამს დააბრუნებს. მაგალითი: sum([1, 2, 3]) აბრუნებს 6-ს.",
                StarterCode = "function sum(numbers) {\n  \n}"
            },
            new CodingTask
            {
                Language = "JavaScript", Difficulty = 2, Title = "პალინდრომი",
                Description = "დაწერე ფუნქცია isPalindrome(text), რომელიც true-ს აბრუნებს, თუ ტექსტი წინიდან და უკნიდან ერთნაირად იკითხება. დიდი და პატარა ასოები და სიმბოლოები (ინტერვალი, პუნქტუაცია) უგულებელყავი. მაგალითი: 'A man, a plan, a canal: Panama' აბრუნებს true-ს.",
                StarterCode = "function isPalindrome(text) {\n  \n}"
            },
            new CodingTask
            {
                Language = "JavaScript", Difficulty = 3, Title = "ანაგრამების დაჯგუფება",
                Description = "დაწერე ფუნქცია groupAnagrams(words), რომელიც სიტყვების მასივს იღებს და ანაგრამებს ერთ ჯგუფში აერთიანებს. მაგალითი: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] აბრუნებს [['eat','tea','ate'], ['tan','nat'], ['bat']]-ს.",
                StarterCode = "function groupAnagrams(words) {\n  \n}"
            },
            new CodingTask
            {
                Language = "Python", Difficulty = 1, Title = "ჯამი",
                Description = "დაწერე ფუნქცია sum_list(numbers), რომელიც სიის ყველა რიცხვის ჯამს დააბრუნებს. მაგალითი: sum_list([1, 2, 3]) აბრუნებს 6-ს.",
                StarterCode = "def sum_list(numbers):\n    "
            },
            new CodingTask
            {
                Language = "Python", Difficulty = 2, Title = "პალინდრომი",
                Description = "დაწერე ფუნქცია is_palindrome(text), რომელიც True-ს აბრუნებს, თუ ტექსტი წინიდან და უკნიდან ერთნაირად იკითხება. დიდი და პატარა ასოები და სიმბოლოები (ინტერვალი, პუნქტუაცია) უგულებელყავი. მაგალითი: 'A man, a plan, a canal: Panama' აბრუნებს True-ს.",
                StarterCode = "def is_palindrome(text):\n    "
            },
            new CodingTask
            {
                Language = "Python", Difficulty = 3, Title = "ანაგრამების დაჯგუფება",
                Description = "დაწერე ფუნქცია group_anagrams(words), რომელიც სიტყვების სიას იღებს და ანაგრამებს ერთ ჯგუფში აერთიანებს. მაგალითი: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] აბრუნებს [['eat','tea','ate'], ['tan','nat'], ['bat']]-ს.",
                StarterCode = "def group_anagrams(words):\n    "
            },
            new CodingTask
            {
                Language = "C#", Difficulty = 1, Title = "ჯამი",
                Description = "დაწერე მეთოდი Sum, რომელიც int მასივის ყველა რიცხვის ჯამს დააბრუნებს. მაგალითი: Sum([1, 2, 3]) აბრუნებს 6-ს.",
                StarterCode = "static int Sum(int[] numbers)\n{\n    \n}"
            },
            new CodingTask
            {
                Language = "C#", Difficulty = 2, Title = "პალინდრომი",
                Description = "დაწერე მეთოდი IsPalindrome, რომელიც true-ს აბრუნებს, თუ ტექსტი წინიდან და უკნიდან ერთნაირად იკითხება. დიდი და პატარა ასოები და სიმბოლოები (ინტერვალი, პუნქტუაცია) უგულებელყავი. მაგალითი: 'A man, a plan, a canal: Panama' აბრუნებს true-ს.",
                StarterCode = "static bool IsPalindrome(string text)\n{\n    \n}"
            },
            new CodingTask
            {
                Language = "C#", Difficulty = 3, Title = "ანაგრამების დაჯგუფება",
                Description = "დაწერე მეთოდი GroupAnagrams, რომელიც string მასივს იღებს და ანაგრამებს ერთ ჯგუფში აერთიანებს (აბრუნებს List<List<string>>). მაგალითი: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] აბრუნებს [['eat','tea','ate'], ['tan','nat'], ['bat']]-ს.",
                StarterCode = "static List<List<string>> GroupAnagrams(string[] words)\n{\n    \n}"
            }
        };

        mongo.Tasks.InsertMany(tasks);
    }
}