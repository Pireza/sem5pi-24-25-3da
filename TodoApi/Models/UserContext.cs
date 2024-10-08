using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } 
     public DbSet<Patient> Patients { get; set; } 
    
    public DbSet<Staff> Staff {get ; set; }
    public DbSet<Appointment> Appointments { get; set; } 
    public DbSet<Specialization> Specializations { get; set; }
     protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .ToTable("Users"); 

            modelBuilder.Entity<Patient>()
                .ToTable("Patients"); 

            modelBuilder.Entity<Staff>().ToTable("Staff");
            modelBuilder.Entity<Specialization>().ToTable("Specializations");
            modelBuilder.Entity<Specialization>()
                .HasKey(s => s.SpecId);

            modelBuilder.Entity<Staff>();

        }
    
}