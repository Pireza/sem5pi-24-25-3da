public class CreatePatientRequest
{
    public string? Username {get; set;}
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Birthday { get; set; } // Formato: DD/MM/YYYY
    public string Gender { get; set; } 
    public int MedicalNumber { get; set; }
    public string Phone { get; set; }
        public string EmergencyContact { get; set; }

    public List<string> MedicalConditions { get; set; } = new List<String> (); // Condições médicas
}
