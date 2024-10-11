using TodoApi.Models;

public class SpecializationStaffDTO
{
    public long Id { get; set; }
    public required string Role { get; set; }
    public required long Specialization { get; set; }
}