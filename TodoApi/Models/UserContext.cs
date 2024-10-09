using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace TodoApi.Models;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Patient> Patients { get; set; }

    public DbSet<Staff> Staff { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Specialization> Specializations { get; set; }
    public DbSet<OperationPriority> Priorities { get; set; }
    public DbSet<OperationType> Types { get; set; }
    public DbSet<OperationRequest> Requests { get; set; }
    public DbSet<AvailabilitySlot> Slots { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .ToTable("Users").HasKey(u => u.Id);

        modelBuilder.Entity<Patient>()
            .ToTable("Patients");
        modelBuilder.Entity<Appointment>()
      .ToTable("Appointment").HasKey(a => a.Id);
        modelBuilder.Entity<AuditLog>()
     .ToTable("AuditLog");
     modelBuilder.Entity<AvailabilitySlot>().ToTable("AvailabilitySlot");

        modelBuilder.Entity<Specialization>()
              .ToTable("Specializations")
              .HasKey(s => s.SpecId);

        // Establishment of a many-to-many relationship between OperationType and Specialization
        modelBuilder.Entity<OperationType>()
            .HasMany(o => o.Specializations)
            .WithMany(s => s.OperationTypes)
            .UsingEntity(j => j.ToTable("OperationType_Specializations"));

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.Appointments); // A patient has many appointments

    }

}