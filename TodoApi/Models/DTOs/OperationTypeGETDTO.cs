public class OperationTypeGETDTO
{
    public required string Name { get; set; }
    public required string Duration { get; set; }
    public required string Status { get; set; }
    public IList<SpecializedStaff> Staff { get; set; }
}