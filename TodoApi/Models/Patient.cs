namespace TodoApi.Models;

 public class Patient : User
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public DateTime Birthday { get; set; }
        public string Gender { get; set; } = null!;
        public string MedicalNumber { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public List<string> MedicalConditions { get; set; } = new List<string>(); // Change to List<string>
        public string EmergencyContact { get; set; } = null!;
        
        // Navigation property for appointments
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }