using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DevLife.Api.Models;

public class DatingProfile
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = "";
    public string Gender { get; set; } = "";
    public int Age { get; set; }
    public string TechStack { get; set; } = "";
    public string Bio { get; set; } = "";
    public string Emoji { get; set; } = "";
    public string Personality { get; set; } = "";
}