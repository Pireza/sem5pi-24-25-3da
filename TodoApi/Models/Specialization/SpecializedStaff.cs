public class SpecializedStaff
{
    public long Id { get; set; }
    public required string Role { get; set; }
    public required ICollection<OperationType> Types { get; set; }
}