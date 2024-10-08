﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TodoApi.Models;

#nullable disable

namespace TodoApi.Migrations
{
    [DbContext(typeof(UserContext))]
    [Migration("20241009070917_AddUserRoleColumn")]
    partial class AddUserRoleColumn
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

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
                });
#pragma warning restore 612, 618
        }
    }
}
