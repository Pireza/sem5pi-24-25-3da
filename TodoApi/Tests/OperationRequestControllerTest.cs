using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using TodoApi.Models;
using Xunit;

public class OperationRequestsControllerUnitTests
{
    private readonly OperationRequestsController _controller;
    private readonly UserContext _context;
    private readonly Mock<OperationRequestRepository> _repmock;
    private readonly OperationController _typeController;

    public OperationRequestsControllerUnitTests()
    {

        // Setup in-memory database
        var options = new DbContextOptionsBuilder<UserContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabaseDoctor2")
            .Options;

        _context = new UserContext(options);

        // Pass the in-memory context to the repository
        var repository = new OperationRequestRepository(_context);

        // Pass the repository to the controller
        _controller = new OperationRequestsController(null, repository)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, "doctor@example.com"),
                        new Claim(ClaimTypes.Role, "Doctor")
                    }))
                }
            }
        };
    }

    [Fact]
    public async Task AddTypeTest()
    {
        var options = new DbContextOptionsBuilder<UserContext>()
            .UseInMemoryDatabase(databaseName: "IsolationTestDbAddType") // Unique name for this test
            .Options;

        var controller = new OperationController(new OperationService(new OperationRequestRepository(new UserContext(options))));

        var ot = new OperationTypeDTO
        {
            Name = "Operation",
            Duration = "01:00:00",
            Staff = [] 
        };

        var result = await controller.PostType(ot);

        // First check if it's of type ActionResult<OperationTypeDTO>
        var actionResult = Assert.IsType<ActionResult<OperationTypeDTO>>(result);

        // Now check if the value is of type CreatedAtActionResult
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);

        // Optional: You can also check the properties of the createdAtActionResult if necessary
        Assert.Equal("GetType", createdAtActionResult.ActionName);
    }
    //UC17
    [Fact]
    public async Task UpdateOperationRequest_ReturnsNotFound_WhenRequestDoesNotExist()
    {
        // Arrange
        long nonExistentId = 999;

        // Act
        var result = await _controller.UpdateOperationRequest(nonExistentId);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
    //UC17

    [Fact]
    public async Task UpdateOperationRequest_UpdatesRequest_WhenAuthorized()
    {
        // Arrange
        var doctorEmail = "doctor@example.com";
        var doctor = new Staff { Email = doctorEmail, Role = "Doctor", UserName = "john.doe" };

        // Seed the in-memory database
       
_context.Requests.Add(new OperationRequest
{
    Id = 1,
    Doctor = doctor,
    Patient = new Patient
    {
        FirstName = "John",
        LastName = "Doe",
        Email = "john@example.com",
        Birthday = DateTime.Parse("1990-01-01"),
        EmergencyContact = "966966967",
        Gender = "Male",
        Phone = "966966966",
        Role = "Patient", // Explicitly setting Role to "Patient"
        UserName = "john.doe"
    },
    OperationType = new OperationType("test", "01:00:00", "active"),
    Deadline = "2024-12-31",
    Status = "Pending",
    Priority = new OperationPriority { Id = 1, Priority = 1, Description = "High" }
});
        _context.SaveChanges();

        // Seed a new operation priority for the test
        _context.Priorities.Add(new OperationPriority { Id = 2, Priority = 2, Description = "Medium" });
        _context.SaveChanges();

        // Act
        var result = await _controller.UpdateOperationRequest(1, 2, "2025-01-01");

        // Verify if the update succeeds
        var updatedRequest = await _context.Requests.FindAsync(1L);
        Assert.NotNull(updatedRequest); // Ensure that the updatedRequest is not null
        Assert.IsType<NoContentResult>(result); // Ensure the result is NoContent
        Assert.Equal(2, updatedRequest.Priority.Id); // Check that the priority ID has been updated
        Assert.Equal("2025-01-01", updatedRequest.Deadline); // Check that the deadline is updated
    }
    //UC17

    [Fact]
    public async Task UpdateOperationRequest_UsesMockRepository()
    {
        // Arrange
        var mockRepository = new Mock<OperationRequestRepository>(_context);
        var controller = new OperationRequestsController(null, mockRepository.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.NameIdentifier, "doctor@example.com"),
                    new Claim(ClaimTypes.Role, "Doctor")
                    }))
                }
            }
        };

        var requestId = 1L;
        var doctor = new Staff { Email = "doctor@example.com", Role = "Doctor", UserName = "john.doe" };

        var operationRequest = new OperationRequest
        {
            Id = requestId,
            Doctor = doctor,
            Patient = new Patient
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
            },
            OperationType = new OperationType("test", "01:00:00", "active"),
            Deadline = "2024-12-31",
            Status = "Pending",
            Priority = new OperationPriority { Id = 1, Priority = 1, Description = "High" }
        };

        // Mock the repository methods
        mockRepository.Setup(repo => repo.GetOperationRequestByIdAsync(requestId))
            .ReturnsAsync(operationRequest);

        var operationPriority = new OperationPriority { Id = 2, Priority = 2, Description = "Medium" };
        mockRepository.Setup(repo => repo.GetOperationPriorityByIdAsync(2))
            .ReturnsAsync(operationPriority); // Mocking to return the priority when requested

        mockRepository.Setup(repo => repo.UpdateOperationRequestAsync(It.IsAny<OperationRequest>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await controller.UpdateOperationRequest(requestId, 2, "2025-01-01");

        // Assert
        Assert.IsType<NoContentResult>(result);
        mockRepository.Verify(repo => repo.UpdateOperationRequestAsync(It.IsAny<OperationRequest>()), Times.Once);
    }


}
