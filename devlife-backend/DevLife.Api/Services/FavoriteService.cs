using System.Text.Json;
using DevLife.Api.Dtos;
using StackExchange.Redis;

namespace DevLife.Api.Services;

public class FavoriteService
{
    private readonly IDatabase _redis;

    public FavoriteService(IConnectionMultiplexer connection)
    {
        _redis = connection.GetDatabase();
    }

    private static string GetKey(int userId)
    {
        return $"favorites:{userId}";
    }

    public async Task Save(int userId, ExcuseResponse excuse)
    {
        var json = JsonSerializer.Serialize(excuse);
        await _redis.HashSetAsync(GetKey(userId), excuse.Id, json);
    }

    public async Task<List<ExcuseResponse>> GetAll(int userId)
    {
        var entries = await _redis.HashGetAllAsync(GetKey(userId));
        var list = new List<ExcuseResponse>();

        foreach (var entry in entries)
        {
            var item = JsonSerializer.Deserialize<ExcuseResponse>(entry.Value.ToString());
            if (item != null)
                list.Add(item);
        }

        return list;
    }

    public async Task Remove(int userId, string id)
    {
        await _redis.HashDeleteAsync(GetKey(userId), id);
    }
}