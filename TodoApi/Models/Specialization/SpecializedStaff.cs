using TodoApi.Models;

public class SpecializedStaff
{
    public long Id { get; set; }
    public required string Role { get; set; }
    public required Specialization Specialization { get; set; }


}