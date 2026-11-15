using DevLife.Api.Models;
using MongoDB.Driver;

namespace DevLife.Api.Data;

public class MongoContext
{
    public IMongoCollection<CodeChallenge> Challenges { get; }
    public IMongoCollection<CodingTask> Tasks { get; }
    public IMongoCollection<DatingProfile> Profiles { get; }

    public MongoContext(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("Mongo"));
        var database = client.GetDatabase("devlife");

        Challenges = database.GetCollection<CodeChallenge>("challenges");
        Tasks = database.GetCollection<CodingTask>("tasks");
        Profiles = database.GetCollection<DatingProfile>("profiles");
    }
}