using TodoApi.Models;

public class CreateStaffRequest
{
    public long Id { get; set; }
    public required string Email { get; set; }
    public string? Role {get; set; }
    public string? Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string LicenseNumber { get; set; } // Unique license number for staff
    public string Phone { get; set; }
    public Specialization? Specialization { get; set; } // Optional, but it can be provided
    public List<AvailabilitySlot> AvailabilitySlots { get; set; } = new List<AvailabilitySlot>(); // Work schedule slots
    public bool IsActive { get; set; } = true; 
}
