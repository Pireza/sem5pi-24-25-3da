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
    public DbSet<OperationType> OperationTypes { get; set; } 
    public DbSet<Patient> Patients { get; set; }

    public DbSet<Staff> Staff { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Specialization> Specializations { get; set; }
    public DbSet<SpecializedStaff> SpecializedStaff { get; set; }
    public DbSet<OperationPriority> Priorities { get; set; }
    public DbSet<OperationType_Staff> Type_Staff { get; set; }
    public DbSet<OperationType> Types { get; set; }
    public DbSet<OperationRequest> Requests { get; set; }
    public DbSet<AvailabilitySlot> Slots { get; set; }
        public DbSet<RequestsLog> RequestsLogs { get; set; }
        public DbSet<AuditLogStaff> AuditLogStaff { get; set; }
        public DbSet<AuditLogOperationType> AuditLogOperationTypes { get; set; }

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

        modelBuilder.Entity<SpecializedStaff>()
              .ToTable("SpecializedStaff")
              .HasKey(s => s.Id);

       modelBuilder.Entity<OperationType_Staff>()
            .HasKey(ots => new { ots.OperationTypeId, ots.SpecializedStaffId });

    modelBuilder.Entity<Patient>()
        .Property(p => p.Role)
        .HasDefaultValue("Patient");

      
        modelBuilder.Entity<Patient>()
            .HasMany(p => p.Appointments); // A patient has many appointments
        modelBuilder.Entity<OperationTypeLog>().ToTable("OperationTypeLog");

        
    modelBuilder.Entity<Staff>()
        .HasOne(s => s.Specialization) 
        .WithMany()                    
        .HasForeignKey(s => s.SpecializationSpecId); 

    
    modelBuilder.Entity<OperationType>()
        .HasOne(o => o.Specialization) 
        .WithMany()                  
        .HasForeignKey(o => o.SpecializationSpecId);

    }



}