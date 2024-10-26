using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

[Index(nameof(Name), IsUnique = true)]
public class OperationType
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Duration { get; set; }
    public string Status { get; set; }
    public bool IsActive { get; set; } = true; // Add an IsActive flag
    public Specialization? Specialization { get; set; }
    public OperationType() { }
    public OperationType(string Name, string Duration, string Status)
    {
        if (ValidDuration(Duration))
        {
            this.Name = Name;
            this.Duration = Duration;
            this.Status = Status;
        }
        else
        {
            throw new ArgumentException();
        }
    }
    private bool ValidDuration(string duration)
    {
        string DurationPattern = @"^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
        Regex regex = new Regex(DurationPattern);

        if (!regex.IsMatch(duration))
            return false;

        return true;
    }
}
