namespace TodoApi.Models;
    public class AuditLog
{
    public long Id { get; set; }
    public long PatientId { get; set; } 
    public DateTime ChangeDate { get; set; }
    public string ChangeDescription { get; set; } 
}

