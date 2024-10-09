﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TodoApi.Models;

#nullable disable

namespace TodoApi.Migrations
{
    [DbContext(typeof(UserContext))]
    partial class UserContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("OperationPriority", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Priorities");
                });

            modelBuilder.Entity("OperationRequest", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Deadline")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<long>("DoctorId")
                        .HasColumnType("bigint");

                    b.Property<long>("OperationTypeId")
                        .HasColumnType("bigint");

                    b.Property<long>("PatientId")
                        .HasColumnType("bigint");

                    b.Property<long>("PriorityId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("OperationTypeId");

                    b.HasIndex("PatientId");

                    b.HasIndex("PriorityId");

                    b.ToTable("Requests");
                });

            modelBuilder.Entity("OperationType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Duration")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Types");
                });

            modelBuilder.Entity("OperationTypeSpecialization", b =>
                {
                    b.Property<long>("OperationTypesId")
                        .HasColumnType("bigint");

                    b.Property<long>("SpecializationsSpecId")
                        .HasColumnType("bigint");

                    b.HasKey("OperationTypesId", "SpecializationsSpecId");

                    b.HasIndex("SpecializationsSpecId");

                    b.ToTable("OperationType_Specializations", (string)null);
                });

            modelBuilder.Entity("TodoApi.Models.Appointment", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<long?>("PatientId")
                        .HasColumnType("bigint");

                    b.Property<long>("RequestId")
                        .HasColumnType("bigint");

                    b.Property<long>("RoomId")
                        .HasColumnType("bigint");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("Appointment", (string)null);
                });

            modelBuilder.Entity("TodoApi.Models.AuditLog", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("ChangeDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("ChangeDescription")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<long>("PatientId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.ToTable("AuditLog", (string)null);
                });

            modelBuilder.Entity("TodoApi.Models.Specialization", b =>
                {
                    b.Property<long>("SpecId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<long>("SpecId"));

                    b.Property<string>("SpecDescription")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("SpecId");

                    b.ToTable("Specializations", (string)null);
                });

            modelBuilder.Entity("TodoApi.Models.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Role")
                        .HasColumnType("longtext");

                    b.Property<string>("UserName")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users", (string)null);

                    b.UseTptMappingStrategy();
                });

            modelBuilder.Entity("TodoApi.Models.Patient", b =>
                {
                    b.HasBaseType("TodoApi.Models.User");

                    b.Property<DateTime>("Birthday")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("EmergencyContact")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("MedicalConditions")
                        .HasColumnType("longtext");

                    b.Property<int>("MedicalNumber")
                        .HasColumnType("int");

                    b.Property<DateTime?>("PendingDeletionDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasIndex("MedicalNumber")
                        .IsUnique();

                    b.HasIndex("Phone")
                        .IsUnique();

                    b.ToTable("Patients", (string)null);
                });

            modelBuilder.Entity("TodoApi.Models.Staff", b =>
                {
                    b.HasBaseType("TodoApi.Models.User");

                    b.Property<string>("AvailabilitySlots")
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .HasColumnType("longtext");

                    b.Property<string>("FullName")
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .HasColumnType("longtext");

                    b.Property<string>("LicenseNumber")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Phone")
                        .HasColumnType("varchar(255)");

                    b.Property<long?>("SpecializationSpecId")
                        .HasColumnType("bigint");

                    b.HasIndex("LicenseNumber")
                        .IsUnique();

                    b.HasIndex("Phone")
                        .IsUnique();

                    b.HasIndex("SpecializationSpecId");

                    b.ToTable("Staff");
                });

            modelBuilder.Entity("OperationRequest", b =>
                {
                    b.HasOne("TodoApi.Models.Staff", "Doctor")
                        .WithMany()
                        .HasForeignKey("DoctorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("OperationType", "OperationType")
                        .WithMany()
                        .HasForeignKey("OperationTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TodoApi.Models.Patient", "Patient")
                        .WithMany("Operations")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("OperationPriority", "Priority")
                        .WithMany()
                        .HasForeignKey("PriorityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Doctor");

                    b.Navigation("OperationType");

                    b.Navigation("Patient");

                    b.Navigation("Priority");
                });

            modelBuilder.Entity("OperationTypeSpecialization", b =>
                {
                    b.HasOne("OperationType", null)
                        .WithMany()
                        .HasForeignKey("OperationTypesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TodoApi.Models.Specialization", null)
                        .WithMany()
                        .HasForeignKey("SpecializationsSpecId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TodoApi.Models.Appointment", b =>
                {
                    b.HasOne("TodoApi.Models.Patient", null)
                        .WithMany("Appointments")
                        .HasForeignKey("PatientId");
                });

            modelBuilder.Entity("TodoApi.Models.Patient", b =>
                {
                    b.HasOne("TodoApi.Models.User", null)
                        .WithOne()
                        .HasForeignKey("TodoApi.Models.Patient", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TodoApi.Models.Staff", b =>
                {
                    b.HasOne("TodoApi.Models.User", null)
                        .WithOne()
                        .HasForeignKey("TodoApi.Models.Staff", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TodoApi.Models.Specialization", "Specialization")
                        .WithMany()
                        .HasForeignKey("SpecializationSpecId");

                    b.Navigation("Specialization");
                });

            modelBuilder.Entity("TodoApi.Models.Patient", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("Operations");
                });
#pragma warning restore 612, 618
        }
    }
}
