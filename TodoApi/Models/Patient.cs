using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;
    [Index(nameof(MedicalNumber), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Phone), IsUnique = true)]
 public class Patient : User
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public DateTime Birthday { get; set; }
        public string Gender { get; set; } = null!;

        public int MedicalNumber { get; set; } 
                public string Phone { get; set; } 
        public List<string>? MedicalConditions { get; set; } = new List<string>(); // Change to List<string>
        public string EmergencyContact { get; set; } 
        
        // Navigation property for appointments
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }