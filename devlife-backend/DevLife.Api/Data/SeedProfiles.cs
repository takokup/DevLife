using DevLife.Api.Models;
using MongoDB.Driver;

namespace DevLife.Api.Data;

public static class SeedProfiles
{
    public static void Seed(MongoContext mongo)
    {
        if (mongo.Profiles.CountDocuments(_ => true) > 0)
            return;

        var profiles = new List<DatingProfile>
        {
            new DatingProfile
            {
                Name = "ნინო", Gender = "female", Age = 24, TechStack = "React", Emoji = "👩‍🎨",
                Bio = "CSS-ს ვუყვარვარ, მაგრამ div-ის ცენტრში მოთავსება დღემდე გამარჯვებად მიმაჩნია.",
                Personality = "ფრონტენდ დეველოპერი, ესთეტიკის მოყვარული, ბევრ ემოჯის იყენებს, CSS-ზე ხუმრობს და ყველაფერს პიქსელებით ზომავს."
            },
            new DatingProfile
            {
                Name = "მარიამი", Gender = "female", Age = 26, TechStack = "Python", Emoji = "👩‍🔬",
                Bio = "ბაგებს ვიჭერ და გველებს ვიზიარებ... Python-ში.",
                Personality = "მშვიდი data-ს მოყვარული, ხშირად ხუმრობს გველებზე და მანქანურ სწავლებაზე, ძალიან ცნობისმოყვარეა."
            },
            new DatingProfile
            {
                Name = "ლიკა", Gender = "female", Age = 25, TechStack = "Angular", Emoji = "💃",
                Bio = "TypeScript-ის გარეშე არ ვცოცხლობ, მაგრამ შენთვის ერთ any-ს მაპატიებ.",
                Personality = "ორგანიზებული და ზუსტი, ნიჭიერი ხუმრობაში, უყვარს შაბლონები და სტრუქტურა."
            },
            new DatingProfile
            {
                Name = "სალომე", Gender = "female", Age = 27, TechStack = ".NET", Emoji = "👩‍💻",
                Bio = "C#-ზე ვწერ და ყავას ვსვამ, ორივე ხშირად გადაუვსებია.",
                Personality = "ენერგიული ბექენდ დეველოპერი, უყვარს ყავა, ღამის დეპლოები და გულწრფელი საუბარი."
            },
            new DatingProfile
            {
                Name = "ანი", Gender = "female", Age = 23, TechStack = "Vue", Emoji = "🌸",
                Bio = "Vue-ს ვეტრფი, რეაქტიულობა ჩემი ცხოვრების წესია.",
                Personality = "მხიარული და სპონტანური, ბევრს იცინის და ყველაფერზე ხუმრობით რეაგირებს."
            },
            new DatingProfile
            {
                Name = "გიორგი", Gender = "male", Age = 28, TechStack = "Java", Emoji = "👨‍💻",
                Bio = "Java ვიცი, ყავასაც გავაკეთებ (მეორე ხუმრობაა).",
                Personality = "სერიოზული enterprise დეველოპერი, ზრდილობიანი, მშრალი იუმორით, უყვარს design pattern-ები."
            },
            new DatingProfile
            {
                Name = "ლუკა", Gender = "male", Age = 24, TechStack = "Node", Emoji = "🧑‍🚀",
                Bio = "JS-ით ვწერ ბექენდს, ასინქრონულობა ჩემი სიყვარულის ენაა.",
                Personality = "ენერგიული და ლაქლაქა, ერთდროულად ხუთ პროექტზე მუშაობს და callback-ებზე ხუმრობს."
            },
            new DatingProfile
            {
                Name = "დავითი", Gender = "male", Age = 29, TechStack = ".NET", Emoji = "🧔",
                Bio = "ბაზებს ვაოპტიმიზებ და ღამღამობით SQL-ს ვხატავ.",
                Personality = "მშვიდი და ინტელექტუალური, სიღრმისეული საუბრის მოყვარული, უყვარს ინდექსები და ლოგიკური თამაშები."
            },
            new DatingProfile
            {
                Name = "ნიკა", Gender = "male", Age = 25, TechStack = "React", Emoji = "😎",
                Bio = "Hooks-ს ვიყენებ და useEffect-ს ჯერ კიდევ ვერ ვუგებ.",
                Personality = "მხიარული და ქარიზმატული, ხუმრობს საკუთარ თავზე, უყვარს სპორტი და hackathon-ები."
            },
            new DatingProfile
            {
                Name = "საბა", Gender = "male", Age = 26, TechStack = "Python", Emoji = "🤓",
                Bio = "ჩემი მოდელი თვითონ მაქვს, ღამით ვავარჯიშებ.",
                Personality = "ცნობისმოყვარე ML ენთუზიასტი, ბევრს ლაპარაკობს მოდელებზე, მაგრამ ადამიანურად და თბილად."
            },
            new DatingProfile
            {
                Name = "Sam", Gender = "other", Age = 25, TechStack = "Vue", Emoji = "🌈",
                Bio = "ფრონტენდის ფანი, UI-ში სიმართლის მეძიებელი.",
                Personality = "კრეატიული და ღია, ყველას ესმის, ხუმრობს დიზაინზე და ძალიან ემპათიურია."
            },
            new DatingProfile
            {
                Name = "Robin", Gender = "other", Age = 27, TechStack = "Java", Emoji = "🦊",
                Bio = "კოდს ვწერ და ჩემს თავსაც ვრეფაქტორებ.",
                Personality = "მშვიდი და ფილოსოფიური, ზრდილობიანი, უყვარს გრძელი საუბრები კოდზე და ცხოვრებაზე."
            }
        };

        mongo.Profiles.InsertMany(profiles);
    }
}