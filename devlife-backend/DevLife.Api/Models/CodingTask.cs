using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DevLife.Api.Models;

public class CodingTask
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Language { get; set; } = "";
    public int Difficulty { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string StarterCode { get; set; } = "";
}