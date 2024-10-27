using TodoApi.Models;
using Xunit;
using System;

public class StaffTest
{
    [Theory]
    [InlineData("johndoe@gmail.com", "johndoe", "Staff", "John", "Doe", "123456", 1, "Nurse", "9669669660")]
    [InlineData("janedoe@gmail.com", "janedoe", "Staff", "Jane", "Doe", "654321", 2, "Doctor", "9669669670")]
    public void WhenPassingCorrectData_NewStaffIsCreated(string email, string username, string role, string firstName, string lastName, string licenseNumber, long specId, string specDescription, string phone)
    {
        var specialization = new Specialization
        {
            SpecId = specId,
            SpecDescription = specDescription
        };

        _ = new Staff
        {
            Email = email,
            UserName = username,
            Role = role,
            FirstName = firstName,
            LastName = lastName,
            LicenseNumber = licenseNumber,
            Specialization = specialization,
            Phone = phone,
            IsActive = true
        };
    }

}
