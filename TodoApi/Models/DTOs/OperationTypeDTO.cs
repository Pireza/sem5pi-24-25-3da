public class OperationTypeDTO
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string Duration { get; set; }
    public required ICollection<long> Staff { get; set; } = [];

}