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
            EmergencyContact = "Jane Doe", 
            Gender = "Male", 
            Phone = "1234567890", 
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
            EmergencyContact = "Jane Doe", 
            Gender = "Male", 
            Phone = "1234567890" ,
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



}
