public class OperationTypeLog
{
    public long Id { get; set; }
    public required OperationType OperationType { get; set; }
    public required string Description { get; set; }
    public required string TimeStamp { get; set; }
}