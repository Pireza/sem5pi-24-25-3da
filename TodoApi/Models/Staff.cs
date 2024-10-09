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
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? FullName { get; set; }
    public string? LicenseNumber { get; set; }
    public Specialization? Specialization { get; set; }
    public string? Phone { get; set; }
    public List<string>? AvailabilitySlots { get; set; }

}