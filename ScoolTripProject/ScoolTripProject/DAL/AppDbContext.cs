using Microsoft.EntityFrameworkCore;
using ScoolTripProject.Models;

namespace ScoolTripProject.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Location> Locations { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>()
        .Property(u => u.UserRole)
        .HasConversion<int>();

    
    modelBuilder.Entity<User>().ToTable("Users");
    modelBuilder.Entity<Class>().ToTable("Class");
    modelBuilder.Entity<Location>().ToTable("Locations");
}

    }
}
