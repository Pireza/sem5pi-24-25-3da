using TodoApi.Models;
using Xunit;
using System;

public class PatientTest
{
    [Theory]
    [InlineData("ericcartman@gmail.com", "cartman445", "Patient", "Eric", "Cartman", "Male", 12345, "966966966", "966966968")]
    [InlineData("stanmarsh@gmail.com", "stan", "Patient", "Stan", "Marsh", "Male", 67890, "966966967", "966966969")]
    public void WhenPassingCorrectData_NewPatientIsCreated(string email, string username, string role, string firstName, string lastName, string gender, int medicalNumber, string phone, string emergencyContact)
    {
        _ = new Patient
        {
            Email = email,
            UserName = username,
            Role = role,
            FirstName = firstName,
            LastName = lastName,
            Gender = gender,
            MedicalNumber = medicalNumber,
            Phone = phone,
            EmergencyContact = emergencyContact
        };
    }

    [Theory]
    [InlineData("invalidemail.com", "cartman445", "Patient", "Eric", "Cartman", "Male", 12345, "123-456-7890", "Kyle")]
    [InlineData("ericcartmangmail.com", "cartman445", "Patient", "Eric", "Cartman", "Male", 12345, "123-456-7890", "Kyle")]
    public void WhenPassingInvalidEmail_ExceptionIsThrown(string email, string username, string role, string firstName, string lastName, string gender, int medicalNumber, string phone, string emergencyContact)
    {
        Assert.Throws<ArgumentException>(() => 
            _ = new Patient
            {
                Email = email,
                UserName = username,
                Role = role,
                FirstName = firstName,
                LastName = lastName,
                Gender = gender,
                MedicalNumber = medicalNumber,
                Phone = phone,
                EmergencyContact = emergencyContact
            });
    }

    [Theory]
    [InlineData("stanmarsh@gmail.com", "st an", "Patient", "Stan", "Marsh", "Male", 67890, "9669669661", "966966968")]
    [InlineData("stanmarsh@gmail.com", " stan", "Patient", "Stan", "Marsh", "Male", 67890, "9669669671", "966966969")]
    public void WhenPassingInvalidPhoneNumber_ExceptionIsThrown(string email, string username, string role, string firstName, string lastName, string gender, int medicalNumber, string phone, string emergencyContact)
    {
        Assert.Throws<ArgumentException>(() =>
            _ = new Patient
            {
                Email = email,
                UserName = username,
                Role = role,
                FirstName = firstName,
                LastName = lastName,
                Gender = gender,
                MedicalNumber = medicalNumber,
                Phone = phone,
                EmergencyContact = emergencyContact
            });
    }

    

    [Theory]
    [InlineData("kylebrofloski@gmail.com", "kyleb", "Patient", "Kyle", "Brofloski", "Male", 34567, "966966966", "9669669681")]
    [InlineData("kylebrofloski@gmail.com", "kyleb", "Patient", "Kyle", "Brofloski", "Male", 34567,  "966966967", "9669669691")]
    public void WhenPassingInvalidEmergencyContact_ExceptionIsThrown(string email, string username, string role, string firstName, string lastName, string gender, int medicalNumber, string phone, string emergencyContact)
    {
        Assert.Throws<ArgumentException>(() =>
            _ = new Patient
            {
                Email = email,
                UserName = username,
                Role = role,
                FirstName = firstName,
                LastName = lastName,
                Gender = gender,
                MedicalNumber = medicalNumber,
                Phone = phone,
                EmergencyContact = emergencyContact
            });
    }
}
