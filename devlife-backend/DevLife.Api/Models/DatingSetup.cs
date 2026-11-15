namespace DevLife.Api.Models;

public class DatingSetup
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Gender { get; set; } = "";
    public string LookingFor { get; set; } = "";
    public string Bio { get; set; } = "";
}