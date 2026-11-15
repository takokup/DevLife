using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace DevLife.Api.Models;
public class CodeChallenge
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
     public string? Id { get; set; }
    public required string Stack { get; set; }
    public required int Difficulty { get; set; } 
    public required string CorrectCode { get; set; }
    public required string BuggyCode { get; set; }
    public required string Explanation { get; set; }
    
}