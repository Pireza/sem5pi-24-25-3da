using TodoApi.Models;

public class OperationRequest
{
    public long Id{get; set;}
    public required Patient Patient {get; set;}
    public required Staff Doctor {get; set;}
    public required OperationType OperationType{get; set;}
    public required DateTime Deadline {get; set;}
    public required OperationPriority Priority {get; set;}

}