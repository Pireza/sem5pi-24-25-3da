using Microsoft.AspNetCore.Mvc;
using MockQueryable.Moq;
using Moq;
using TodoApi.Controllers;
using TodoApi.Models;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MockQueryable;
using Microsoft.EntityFrameworkCore;

public class PatientsControllerUnitTests
{
    private readonly Mock<UserRepository> _repositoryMock;
    private readonly PatientsController _controller;

    public PatientsControllerUnitTests()
    {
        _repositoryMock = new Mock<UserRepository>(MockBehavior.Strict);
        _controller = new PatientsController(null, null, null, _repositoryMock.Object);
    }
    //UC11
    [Fact]
    public async Task GetPatientsByAttributes_ReturnsPatientsByName()
    {
        // Arrange
        var patients = new List<Patient>
        {
            new Patient { Id = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com", Birthday = DateTime.Parse("1990-01-01") }
        };

        var queryablePatients = patients.AsQueryable().BuildMock(); // Assuming BuildMock works with your IQueryable
        _repositoryMock.Setup(repo => repo.GetPatientsQueryable()).Returns(queryablePatients); // Use Object to access the mocked IQueryable

        // Act
        var result = await _controller.GetPatientsByAttributes(dateOfBirth: "01/01/1990");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = okResult.Value as dynamic; // Use dynamic to access anonymous type properties

        // Accessing the Patients property directly as IEnumerable<dynamic>
        var patientsList = ((IEnumerable<dynamic>)response.Patients).ToList();

        Assert.Equal(1, response.TotalRecords);
        Assert.Equal("John", patientsList.First().FirstName); // Access FirstName directly
    }
//UC11
// Integration Test with Some Isolation
[Fact]
public async Task GetPatientsByAttributes_IntegrationTest_WithIsolation_ReturnsPatientsByName()
{
    // Arrange
    var options = new DbContextOptionsBuilder<UserContext>()
        .UseInMemoryDatabase(databaseName: "IsolationTestDb") // Unique name for this test
        .Options;

    // Seed the in-memory database
    using (var context = new UserContext(options))
    {
        context.Patients.Add(new Patient 
        { 
            FirstName = "John", 
            LastName = "Doe", 
            Email = "john@example.com", 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966", 
            Role = "Patient", 
        UserName = "john.doe" 
        });
        context.SaveChanges();
    }

    // Setup repository with a mocked version
    var mockRepo = new Mock<UserRepository>(MockBehavior.Strict);
    mockRepo.Setup(repo => repo.GetPatientsQueryable()).Returns(new UserContext(options).Patients.AsQueryable());

    var controller = new PatientsController(null, null, null, mockRepo.Object);

    // Act
    var result = await controller.GetPatientsByAttributes(email: "john@example.com");

    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result.Result);
    var response = okResult.Value as dynamic;
    var patientsList = ((IEnumerable<dynamic>)response.Patients).ToList();

    Assert.Equal(1, response.TotalRecords);
    Assert.Equal("John", patientsList.First().FirstName);
}

    //UC11
  [Fact]
public async Task GetPatientsByAttributes_IntegrationTest_ReturnsPatientsByName()
{
    // Arrange
    var options = new DbContextOptionsBuilder<UserContext>()
        .UseInMemoryDatabase(databaseName: "TestDb") // Use InMemory database
        .Options;

    // Seed the in-memory database
    using (var context = new UserContext(options))
    {
        context.Patients.Add(new Patient 
        { 
            FirstName = "John", 
            LastName = "Doe", 
            Email = "john@example.com", 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966" ,
            Role = "Patient", 
        UserName = "john.doe" 
        });
        context.SaveChanges();
    }

    // Setup repository - using the same options to get the same context
    UserRepository repository = new UserRepository(new UserContext(options));
    
    var controller = new PatientsController(null, null, null, repository);

    // Act
    var result = await controller.GetPatientsByAttributes(name: "John");

    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result.Result);
    var response = okResult.Value as dynamic;
    var patientsList = ((IEnumerable<dynamic>)response.Patients).ToList();

    Assert.Equal(1, response.TotalRecords);
    Assert.Equal("John", patientsList.First().FirstName);
}
//UC11
[Fact]
public async Task GetPatientsByAttributes_IntegrationTest_ReturnsNoPatients()
{
    // Arrange
    var options = new DbContextOptionsBuilder<UserContext>()
        .UseInMemoryDatabase(databaseName: "NoPatientsTestDb") // Unique name for this test
        .Options;

    var repository = new UserRepository(new UserContext(options));
    var controller = new PatientsController(null, null, null, repository);

    // Act
    var result = await controller.GetPatientsByAttributes(name: "NonExistent");

    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result.Result);
    var response = okResult.Value as dynamic;
    Assert.Equal(0, response.TotalRecords);
    Assert.Empty((IEnumerable<dynamic>)response.Patients);
}



 //UC4
 [Fact]
public async Task PutPatientByEmail_ReturnsNoContent_WhenPatientExists()
{
    // Arrange
    var email = "john@example.com";
    var patient = new Patient
    {
        FirstName = "John", 
            LastName = "Doe", 
            Email = email, 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966" ,
            Role = "Patient", 
        UserName = "john.doe" 
    };

    // Set up the repository mock to return the existing patient
    _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync(patient);
    _repositoryMock.Setup(repo => repo.UpdatePatientAsync(It.IsAny<Patient>())).Returns(Task.CompletedTask);
    _repositoryMock.Setup(repo => repo.LogAuditChangeAsync(patient.Id, It.IsAny<List<string>>())).Returns(Task.CompletedTask);

    // Act
    var result = await _controller.PutPatientByEmail(email, firstName: "Johnny");

    // Assert
    Assert.IsType<NoContentResult>(result); // Check for No Content response
    Assert.Equal("Johnny", patient.FirstName); // Check if the first name was updated

    // Verify that the update method was called
    _repositoryMock.Verify(repo => repo.UpdatePatientAsync(It.Is<Patient>(p => p.Id == patient.Id && p.FirstName == "Johnny")), Times.Once);
}


    // UC4
    [Fact]
    public async Task PutPatientByEmail_ReturnsNotFound_WhenPatientDoesNotExist()
    {
        // Arrange
        var email = "nonexistent@example.com";

        _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync((Patient)null);

        // Act
        var result = await _controller.PutPatientByEmail(email);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    // UC4
    [Fact]
    public async Task PutPatientByEmail_ReturnsNoContent_WhenOnlyEmergencyContactIsUpdated()
    {
        // Arrange
        var email = "john@example.com";
        var patient = new Patient
        {
            FirstName = "John", 
            LastName = "Doe", 
            Email = email, 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966" ,
            Role = "Patient", 
        UserName = "john.doe"
        };

        _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync(patient);
        _repositoryMock.Setup(repo => repo.UpdatePatientAsync(patient)).Returns(Task.CompletedTask);
        _repositoryMock.Setup(repo => repo.LogAuditChangeAsync(patient.Id, It.IsAny<List<string>>())).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.PutPatientByEmail(email, emergencyContact: "966966968");

        // Assert
        Assert.IsType<NoContentResult>(result);
        Assert.Equal("966966968", patient.EmergencyContact); // Check if the emergency contact was updated
    }
    
    // UC4
    [Fact]
    public async Task PutPatientByEmail_ReturnsNoContent_WhenNoFieldsUpdated()
    {
        // Arrange
        var email = "john@example.com";
        var patient = new Patient
        {
            FirstName = "John", 
            LastName = "Doe", 
            Email = email, 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966" ,
            Role = "Patient", 
        UserName = "john.doe"
        };

        _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync(patient);
        _repositoryMock.Setup(repo => repo.UpdatePatientAsync(patient)).Returns(Task.CompletedTask);
        _repositoryMock.Setup(repo => repo.LogAuditChangeAsync(patient.Id, It.IsAny<List<string>>())).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.PutPatientByEmail(email);

        // Assert
        Assert.IsType<NoContentResult>(result);
        Assert.Equal("John", patient.FirstName); // Ensure no changes were made
    }


// UC4 - Integration Test with Some Isolation
[Fact]
public async Task PutPatientByEmail_IntegrationTest_WithIsolation_ReturnsNoContent_WhenPatientExists()
{
    // Arrange
    var options = new DbContextOptionsBuilder<UserContext>()
        .UseInMemoryDatabase(databaseName: "IsolationPutPatientTestDb") // Unique name for this test
        .Options;

    // Seed the in-memory database
    using (var context = new UserContext(options))
    {
        context.Patients.Add(new Patient
        {
             FirstName = "John", 
            LastName = "Doe", 
            Email = "john@example.com", 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966" ,
            Role = "Patient", 
        UserName = "john.doe"
        });
        context.SaveChanges();
    }

    // Setup repository with the seeded database
    var repository = new UserRepository(new UserContext(options));
    var controller = new PatientsController(null, null, null, repository);

    // Act
    var result = await controller.PutPatientByEmail("john@example.com", firstName: "Johnny");

    // Assert
    Assert.IsType<NoContentResult>(result); // Check for No Content response

    // Verify that the first name was updated
    using (var context = new UserContext(options))
    {
        var updatedPatient = await context.Patients.FindAsync(1L);
        Assert.Equal("Johnny", updatedPatient.FirstName); // Check if the first name was updated
    }
}

// UC5 - Integration Test with Some Isolation
[Fact]
public async Task DeletePatientByEmail_IntegrationTest_WithIsolation_ReturnsNoContent_WhenPatientExists()
{
    // Arrange
    var options = new DbContextOptionsBuilder<UserContext>()
        .UseInMemoryDatabase(databaseName: "IsolationDeletePatientTestDb") // Unique name for this test
        .Options;

    // Seed the in-memory database
    using (var context = new UserContext(options))
    {
        context.Patients.Add(new Patient
        {
              FirstName = "John", 
            LastName = "Doe", 
            Email = "john@example.com", 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966" ,
            Role = "Patient", 
        UserName = "john.doe"
        });
        context.SaveChanges();
    }

    // Setup repository with the seeded database
    var repository = new UserRepository(new UserContext(options));
    var controller = new PatientsController(null, null, null, repository);

    // Act
    var result = await controller.DeletePatientByEmail("john@example.com");

    // Assert
    Assert.IsType<NoContentResult>(result); // Check for No Content response

    // Verify the patient was marked for deletion
    using (var context = new UserContext(options))
    {
        var deletedPatient = await context.Patients.FirstOrDefaultAsync(p => p.Email == "john@example.com");
        Assert.NotNull(deletedPatient); // Ensure the patient exists
        Assert.NotNull(deletedPatient.PendingDeletionDate); // Ensure the deletion date is set
    }

}
// UC5 - Unit Test Using Mock for Repository
[Fact]
public async Task DeletePatientByEmail_UnitTest_UsingMock_ReturnsNoContent_WhenPatientExists()
{
    // Arrange
    var email = "john@example.com";
    var patient = new Patient
    {
          FirstName = "John", 
            LastName = "Doe", 
            Email = "john@example.com", 
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967", 
            Gender = "Male", 
            Phone = "966966966" ,
            Role = "Patient", 
        UserName = "john.doe"
    };

    // Set up the repository mock to return the existing patient
    _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync(patient);
    _repositoryMock.Setup(repo => repo.AddAuditLogForDeletionAsync(email)).Returns(Task.CompletedTask);
    _repositoryMock.Setup(repo => repo.UpdatePatientAsync(It.IsAny<Patient>())).Returns(Task.CompletedTask);

    // Act
    var result = await _controller.DeletePatientByEmail(email);

    // Assert
    Assert.IsType<NoContentResult>(result); // Check for No Content response

    // Verify that the patient was marked for deletion
    _repositoryMock.Verify(repo => repo.UpdatePatientAsync(It.Is<Patient>(p => p.Email == email && p.PendingDeletionDate != null)), Times.Once);
    _repositoryMock.Verify(repo => repo.AddAuditLogForDeletionAsync(email), Times.Once); // Ensure that the audit log method was called
}

// UC5 - Unit Test for Deleting a Non-Existing Patient
[Fact]
public async Task DeletePatientByEmail_UnitTest_ReturnsNotFound_WhenPatientDoesNotExist()
{
    // Arrange
    var email = "nonexistent@example.com";

    // Set up the repository mock to return null for the non-existent patient
    _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync((Patient)null);

    // Act
    var result = await _controller.DeletePatientByEmail(email);

    // Assert
    Assert.IsType<NotFoundResult>(result); // Check for Not Found response

    // Verify that no other methods were called
    _repositoryMock.Verify(repo => repo.AddAuditLogForDeletionAsync(email), Times.Never); // Ensure audit log method was not called
    _repositoryMock.Verify(repo => repo.UpdatePatientAsync(It.IsAny<Patient>()), Times.Never); // Ensure update method was not called
}

// UC8 - Unit Tests for CreatePatientAsAdmin
[Fact]
public async Task CreatePatientAsAdmin_ReturnsBadRequest_WhenRequiredFieldsAreMissing()
{
    // Arrange
    var request = new CreatePatientRequest
    {
        FirstName = "", // Missing required field
        LastName = "Doe",
        Birthday = "10/10/1990",
        Phone = "123456789",
        EmergencyContact = "987654321",
        Gender = "Male"
    };

    // Act
    var result = await _controller.CreatePatientAsAdmin(request);

    // Assert
    Assert.IsType<BadRequestObjectResult>(result.Result);
    Assert.Equal("First name and last name are required.", ((BadRequestObjectResult)result.Result).Value);
}

[Fact]
public async Task CreatePatientAsAdmin_ReturnsBadRequest_WhenInvalidDateFormat()
{
    // Arrange
    var request = new CreatePatientRequest
    {
        FirstName = "John",
        LastName = "Doe",
        Birthday = "1990-01-01", // Invalid format
        Phone = "123456789",
        EmergencyContact = "987654321",
        Gender = "Male"
    };

    // Act
    var result = await _controller.CreatePatientAsAdmin(request);

    // Assert
    Assert.IsType<BadRequestObjectResult>(result.Result);
    Assert.Equal("Invalid date format. Use DD/MM/YYYY.", ((BadRequestObjectResult)result.Result).Value);
}

[Fact]
public async Task CreatePatientAsAdmin_ReturnsBadRequest_WhenPhoneOrEmergencyContactIsMissing()
{
    // Arrange
    var request = new CreatePatientRequest
    {
        FirstName = "John",
        LastName = "Doe",
        Birthday = "10/10/1990",
        Phone = "", // Missing phone
        EmergencyContact = "987654321",
        Gender = "Male"
    };

    // Act
    var result = await _controller.CreatePatientAsAdmin(request);

    // Assert
    Assert.IsType<BadRequestObjectResult>(result.Result);
    Assert.Equal("The phone number and emergency contact should be provided.", ((BadRequestObjectResult)result.Result).Value);
}

[Fact]
public async Task CreatePatientAsAdmin_ReturnsConflict_WhenPatientAlreadyExists()
{
    // Arrange
    var request = new CreatePatientRequest
    {
        FirstName = "John",
        LastName = "Doe",
        Birthday = "10/10/1990",
        Phone = "123456789",
        EmergencyContact = "987654321",
        Gender = "Male",
        Email = "john@example.com",
        MedicalNumber = 12345
    };

    _repositoryMock.Setup(repo => repo.checkEmail(request)).ReturnsAsync(new Patient());

    // Act
    var result = await _controller.CreatePatientAsAdmin(request);

    // Assert
    Assert.IsType<ConflictObjectResult>(result.Result);
    Assert.Equal("A patient with the same medical number or email already exists.", ((ConflictObjectResult)result.Result).Value);
}

/*
    // UC10 - Unit Test for Deleting a Patient by Email
    [Fact]
    public async Task DeletePatientByEmailAsAdmin_UnitTest_ReturnsNoContent_WhenPatientExists()
    {
        // Arrange
        var email = "john@example.com";
        var patient = new Patient
        {
            FirstName = "John",
            LastName = "Doe",
            Email = email,
            Birthday = DateTime.Parse("1990-01-01"),
            EmergencyContact = "966966967",
            Gender = "Male",
            Phone = "966966966",
            Role = "Patient",
            UserName = "john.doe"
        };
        // Set up the repository mock to return the existing patient
        _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync(patient);
        _repositoryMock.Setup(repo => repo.AddAuditLogForDeletionAsync(email)).Returns(Task.CompletedTask);
        _repositoryMock.Setup(repo => repo.UpdatePatientAsync(It.IsAny<Patient>())).Returns(Task.CompletedTask);
        // Act
        var result = await _controller.DeletePatientByEmailAsAdmin(email);
        // Assert
        Assert.IsType<NoContentResult>(result); // Check for No Content response
        // Verify that the patient was marked for deletion
        _repositoryMock.Verify(repo => repo.UpdatePatientAsync(It.Is<Patient>(p => p.Email == email && p.PendingDeletionDate != null)), Times.Once);
        _repositoryMock.Verify(repo => repo.AddAuditLogForDeletionAsync(email), Times.Once); // Ensure that the audit log method was called
    }
*/
    // UC10 - Unit Test for Attempting to Delete a Non-Existing Patient
    [Fact]
    public async Task DeletePatientByEmailAsAdmin_UnitTest_ReturnsNotFound_WhenPatientDoesNotExist()
    {
        // Arrange
        var email = "nonexistent@example.com";
        // Set up the repository mock to return null for the non-existent patient
        _repositoryMock.Setup(repo => repo.GetPatientByEmailAsync(email)).ReturnsAsync((Patient)null);
        // Act
        var result = await _controller.DeletePatientByEmailAsAdmin(email);
        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result); // Change to NotFoundObjectResult
        Assert.Equal("Patient not found.", notFoundResult.Value); // Check if the returned message is correct
        // Verify that no other methods were called
        _repositoryMock.Verify(repo => repo.AddAuditLogForDeletionAsync(email), Times.Never); // Ensure audit log method was not called
        _repositoryMock.Verify(repo => repo.UpdatePatientAsync(It.IsAny<Patient>()), Times.Never); // Ensure update method was not called
    }

/*
    // UC10 - Integration Test for Deleting a Patient by Email
    [Fact]
    public async Task DeletePatientByEmailAsAdmin_IntegrationTest_WithIsolation_ReturnsNoContent_WhenPatientExists()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<UserContext>()
            .UseInMemoryDatabase(databaseName: "IsolationDeletePatientTestDb") // Unique name for this test
            .Options;
        // Seed the in-memory database
        using (var context = new UserContext(options))
        {
            context.Patients.Add(new Patient
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Birthday = DateTime.Parse("1990-01-01"),
                EmergencyContact = "966966967",
                Gender = "Male",
                Phone = "966966966",
                Role = "Patient",
                UserName = "john.doe"
            });
            context.SaveChanges();
        }
        // Setup repository with the seeded database
        var repository = new UserRepository(new UserContext(options));
        var controller = new PatientsController(null, null, null, repository);
        // Act
        var result = await controller.DeletePatientByEmailAsAdmin("john@example.com");
        // Assert
        Assert.IsType<NoContentResult>(result); // Check for No Content response
        // Verify the patient was marked for deletion
        using (var context = new UserContext(options))
        {
            var deletedPatient = await context.Patients.FirstOrDefaultAsync(p => p.Email == "john@example.com");
            Assert.NotNull(deletedPatient); // Ensure the patient exists
            Assert.NotNull(deletedPatient.PendingDeletionDate); // Ensure the deletion date is set
        }
    }
    */
    // UC10 - Integration Test for Deleting a Non-Existing Patient
    [Fact]
    public async Task DeletePatientByEmailAsAdmin_IntegrationTest_ReturnsNotFound_WhenPatientDoesNotExist()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<UserContext>()
            .UseInMemoryDatabase(databaseName: "NoPatientsDb") // Unique name for this test
            .Options;
        // Setup repository with the seeded database
        var repository = new UserRepository(new UserContext(options));
        var controller = new PatientsController(null, null, null, repository);
        // Act
        var result = await controller.DeletePatientByEmailAsAdmin("nonexistent@example.com");
        // Assert
        Assert.IsType<NotFoundObjectResult>(result); // Check for Not Found response
    }
}
