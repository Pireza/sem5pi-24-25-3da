public class CreatePatientRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Birthday { get; set; } // Formato: DD/MM/YYYY
    public int MedicalNumber { get; set; }
    public string Phone { get; set; }
    public List<string> MedicalConditions { get; set; } = new List<String> (); // Condições médicas
}
