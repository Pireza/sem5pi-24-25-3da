using TodoApi.Models;

public class OperationType{
    public long Id {get; set;}
    public required string Name {get; set;}
    public required TimeSpan Duration {get; set;}
    public required ICollection<Specialization> Specializations {get; set;} = [];
    
}