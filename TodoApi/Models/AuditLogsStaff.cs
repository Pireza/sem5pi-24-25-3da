namespace TodoApi.Models;
    public class AuditLogStaff
{
    public long Id { get; set; }
    public long StaffId { get; set; } 
    public DateTime ChangeDate { get; set; }
    public string ChangeDescription { get; set; } 
}

