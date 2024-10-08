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
    public DbSet<Appointment> Appointments { get; set; } 
        public DbSet<AuditLog> AuditLogs { get; set; }

     protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .ToTable("Users").HasKey(u=>u.Id); 

            modelBuilder.Entity<Patient>()
                .ToTable("Patients");
                  modelBuilder.Entity<Appointment>()
                .ToTable("Appointment").HasKey(a=>a.Id); 
                   modelBuilder.Entity<AuditLog>()
                .ToTable("AuditLog"); 
            
          
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Appointments); // A patient has many appointments
            
        }
    
}