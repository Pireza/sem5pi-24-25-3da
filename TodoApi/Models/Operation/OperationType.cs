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
     public long? SpecializationSpecId { get; set; } 
    public Specialization? Specialization { get; set; } 
    public OperationType() { }
    /// <summary>
    /// Basic constructor for this class which calls ValidDuration()
    /// which ensures the Duration argument is correctly formatted
    /// </summary>
    /// <param name="Name">Name of the type</param>
    /// <param name="Duration">Duration of the type in format HH:mm:ss</param>
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
