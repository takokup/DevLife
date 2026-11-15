using DevLife.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DevLife.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<GameRound> GameRounds { get; set; }
    public DbSet<BugChaseScore> BugChaseScores { get; set; }
    public DbSet<DatingSetup> DatingSetups { get; set; }
    public DbSet<DatingSwipe> DatingSwipes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<User>().Property(u => u.Points).HasDefaultValue(100);

        modelBuilder.Entity<DatingSetup>().HasIndex(s => s.UserId).IsUnique();
        modelBuilder.Entity<DatingSwipe>().HasIndex(s => new { s.UserId, s.ProfileId }).IsUnique();
    }
}