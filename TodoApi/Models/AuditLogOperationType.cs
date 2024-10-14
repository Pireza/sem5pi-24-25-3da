namespace TodoApi.Models
{
    public class AuditLogOperationType
    {
        public long Id { get; set; }  // Primary Key for the audit log entry
        public long EntityId { get; set; }  // ID of the related OperationType entity
        public string EntityName { get; set; }  // The name of the entity, i.e., "OperationType"
        public string Action { get; set; }  // Action performed, i.e., "Deactivated"
        public DateTime ChangeDate { get; set; }  // Date and time when the change occurred
        public string Description { get; set; }  // Description of the change (e.g., "Operation type 'X' deactivated by admin.")
    }
}



