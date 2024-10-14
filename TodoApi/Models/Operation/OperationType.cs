using Microsoft.EntityFrameworkCore;

[Index(nameof(Name), IsUnique = true)]
public class OperationType
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string Duration { get; set; }
    public required string Status { get; set; }
    public bool IsActive { get; set; } = true; // Add an IsActive flag
}
