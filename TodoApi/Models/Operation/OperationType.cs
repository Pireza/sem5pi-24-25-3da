using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[Index(nameof(Name), IsUnique = true)]
public class OperationType
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string Duration { get; set; }
    public required string Status { get; set; }
    public ICollection<Specialization>? Specializations { get; set; } = [];

}