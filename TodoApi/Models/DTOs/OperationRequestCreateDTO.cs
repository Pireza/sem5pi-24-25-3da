public class OperationRequestCreateDTO

{
    public long PatientId { get; set; }
    public long OperationTypeId { get; set; }
    public long PriorityId { get; set; } 
    public string Deadline { get; set; }
}
