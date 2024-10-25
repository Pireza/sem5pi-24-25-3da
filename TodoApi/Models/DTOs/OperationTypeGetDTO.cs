public class OperationTypeGetDTO
{
    public required string Name { get; set; }
    public required string Duration { get; set; }
    public bool IsActive { get; set; }
    public required IList<string> SpecializedStaff { get; set; }
}