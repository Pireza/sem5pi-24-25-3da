using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;
    [Index(nameof(Email),IsUnique = true)]

public class User
{
    public long Id { get; set; }
    public required string Email { get; set; }
    public string? UserName { get; set; }
}