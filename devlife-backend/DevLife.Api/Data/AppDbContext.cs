using DevLife.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DevLife.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){ }

    public DbSet<User> Users { get; set; }
}