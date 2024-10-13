public class RequestsLog
{
    public long Id { get; set; }
    public required long RequestId { get; set; }
    public DateTime ChangeDate { get; set; }
    public string ChangeDescription { get; set; } 
}