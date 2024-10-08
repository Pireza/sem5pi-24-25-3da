using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices.Marshalling;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace TodoApi.Models;
[Index(nameof(LicenseNumber), IsUnique = true)]
[Index(nameof(Phone), IsUnique = true)]
 public class Staff : User
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string FullName {get; set; }
        public required string LicenseNumber {get; set; }
        public required Specialization Specialization {get; set;}
        public required string Phone {get; set;}
        public List<string>? AvailabilitySlots {get; set;}

    }