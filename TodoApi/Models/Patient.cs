using System.Text.Json.Serialization;
using Auth0.ManagementApi.Models.Actions;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace TodoApi.Models
{
    [Index(nameof(MedicalNumber), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Phone), IsUnique = true)]
    public class Patient : User
    {
        private string _phone = string.Empty;
        private string _emergencyContact = string.Empty;

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;

        public DateTime Birthday { get; set; }
        public string Gender { get; set; } = null!;

        public int MedicalNumber { get; set; }

        public string Phone
        {
            get => _phone;
            set
            {
                if (!IsValidPhoneNumber(value))
                    throw new ArgumentException("Phone must be a 9-digit number.");
                _phone = value;
            }
        }

        public List<string>? MedicalConditions { get; set; } = new List<string>();

        public string EmergencyContact
        {
            get => _emergencyContact;
            set
            {
                if (!IsValidPhoneNumber(value))
                    throw new ArgumentException("Emergency Contact must be a 9-digit number.");
                _emergencyContact = value;
            }
        }

        public DateTime? PendingDeletionDate { get; set; } = null;

        public virtual ICollection<OperationRequest> Operations { get; set; } = new List<OperationRequest>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        private bool IsValidPhoneNumber(string number) =>
            Regex.IsMatch(number, @"^\d{9}$");
  public override string Role
    {
        get
        {
            return "Patient"; // Always return "Patient"
        }
    }


    }
}
